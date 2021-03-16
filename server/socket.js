const jwt = require('./utils/jwt')
const validate = require('./utils/validate-socket-data')
const db = require('./db/query')
const cookie = require('cookie')
const createUserData = require('./utils/create-user-data')

module.exports = io => {
    // cache keeps track of connected users by id and their assigned socket id
    // it is updated on every connect and disconnect 
    let userIDToSocketIDCache = {}
    let socketsCount = 0
    let clientsCount = 0

    io.on('connect', async (socket) => {
        const cookies = cookie.parse(socket.request.headers.cookie || '')
        let token = cookies['x-auth-token'] || ''
        let data = await jwt.verifyToken(token)

        if (!data) { // overkill
            sysLog(`Connect @ ${socket.id}. Connection refused (JSON Web Token Error)`)
            socket.disconnect()
            return
        }

        let userData = await db.getUserData(data.userID)
        if (!userData) {  // overkill
            sysLog(`Connect @ ${socket.id}. Connection refused (Unknown username: ${data.username})`)
            socket.disconnect()
            return
        }

        let messagePool = await db.getMessages(userData)

        userIDToSocketIDCache[userData._id] = [...userIDToSocketIDCache[userData._id] || [], socket.id]
        const firstConnection = userIDToSocketIDCache[userData._id].length === 1
        firstConnection && clientsCount++
        socketsCount++
        sysLog(`Connect @ ${socket.id} (${userData._id}). Total clients/connections in pool: ${clientsCount}/${socketsCount}.`)

        const clientData = createUserData(userData, messagePool)

        userData.groups.forEach(({ _id }) => socket.join(_id.toString()))

        for (const user in clientData.associatedUsers) {
            let userIsOnline = Boolean(userIDToSocketIDCache[user])
            clientData.associatedUsers[user].online = userIsOnline
            if (user !== userData._id.toString() && firstConnection && userIsOnline) {
                userIDToSocketIDCache[user].forEach(sid => {
                    io.to(sid).emit('online-message',
                        {
                            _id: userData._id,
                            name: userData.name,
                            username: userData.username,
                            picture: userData.picture,
                            online: true
                        }
                    )
                })
            }
        }
        // console.log(JSON.stringify(clientData, null, 4),'\n','clientData END')
        socket.emit('welcome-message', clientData)

        // EVENT LISTENERS SECTION
        // Notify users on disconnect
        socket.on('disconnecting', (reason) => {
            userIDToSocketIDCache[userData._id] = userIDToSocketIDCache[userData._id].filter(s => s !== socket.id)
            socketsCount--

            // send offline status if last connection
            if (userIDToSocketIDCache[userData._id].length === 0) {
                delete userIDToSocketIDCache[userData._id]
                clientsCount--
                const onlineUsers = new Set()
                socket.rooms.forEach(room => {
                    io.sockets.adapter.rooms.get(room).forEach(sid => {
                        onlineUsers.add(sid)
                    })
                })
                onlineUsers.delete(socket.id)
                onlineUsers.forEach(sid => {
                    io.to(sid).emit('quit-message',
                        {
                            _id: userData._id,
                            name: userData.name,
                        }
                    )
                })
            }
            sysLog(`Disconnect @ ${socket.id} (${userData._id}). Reason: ${reason}. Total clients/connections in pool: ${clientsCount}/${socketsCount}.`)
        })

        socket.on('disconnect', () => {
            socket.removeAllListeners()
        })

        socket.on('group-chat-message', async (socketData, callback) => {
            let src = userData._id.toString()
            const validation = validate.messageData(src, socketData)
            if (validation.failed) {
                if (validation.error) callback(validation.error)
                return
            }

            const { msg, type, dst } = socketData
            let newMessage = await db.createPublicMessage(src, dst, msg, type)
            if (!newMessage.success) {
                sysLog(`Message from ${src} failed: ${newMessage.error}`)
                callback('Message not sent')
                return
            }

            // --- PATCH: 
            // While socket will not recieve any messages when room is left,
            // it seems like it can still send message to previously left room
            // Currently membership check in DB will stop the user from sending the message
            // so this check is unecessary but that doesn't fix the leak
            if (io.sockets.adapter.rooms.has(dst) && io.sockets.adapter.rooms.get(dst).has(socket.id)) { // Map of Sets
                socket.to(dst).emit('group-chat-message', { src, msg, type, dst, site: newMessage.site })
                callback()
            } else {
                sysLog(`Message from ${src} failed: Socket not connected to room.`)
                callback('Message not sent')
            }
        })

        socket.on('single-chat-message', async (socketData, callback) => {
            let src = userData._id.toString()
            const validation = validate.messageData(src, socketData)
            if (validation.failed) {
                if (validation.error) callback(validation.error)
                return
            }

            const { msg, type, dst } = socketData
            let newMessage = await db.createPrivateMessage(src, dst, msg, type)
            if (!newMessage.success) {
                sysLog(`Message from ${src} failed: ${newMessage.error}`)
                return
            }

            // if recipient is online send message to all his connected sockets
            if (userIDToSocketIDCache[dst]) {
                userIDToSocketIDCache[dst].forEach(sid => {
                    io.to(sid).emit('single-chat-message', { src, dst: src, msg, type })
                })
            }

            sysLog(`Message (private): ${src} >> ${dst}`)

            // update rest of sender connected sockets
            if (dst !== src) restSocketsUpdate(src, socket.id, 'single-chat-message', { src, dst, msg, type })
            callback()
        })

        socket.on('close-chat', async chat => {
            await db.removeChat(userData._id, chat)
        })

        socket.on('create-site', async (socketData, callback) => { //admin
            const validation = validate.siteData(userData._id, socketData)
            if (validation.failed) {
                callback(false, validation.error)
                return
            }
            const { site, description } = validation.data
            const data = await db.createSite(site, description, userData._id)
            if (data.success) {
                let groupID = data.groupID.toString()
                socket.join(groupID)
                const siteData = {
                    [data.siteID]: {
                        name: site,
                        description,
                        creator: userData._id,
                        groups: {
                            [groupID]: {
                                name: 'General',
                                members: [userData._id],
                                messages: [{
                                    notice: true,
                                    event: 'system',
                                    timestamp: utcTime(),
                                    msg: `Hello ${userData.name}. Welcome to your new project: ${site}. You can invite members or start creating groups now.`
                                }]
                            }
                        }
                    }
                }
                callback(true, siteData)
                restSocketsJoin(userData._id, socket.id, groupID)
                restSocketsUpdate(userData._id, socket.id, 'create-site', siteData)
            } else {
                callback(false, data.errors)
            }
        })

        socket.on('create-group', async (socketData, callback) => { //admin
            const validation = validate.groupData(userData._id, socketData)
            if (validation.failed) {
                if (validation.error) callback(false, [validation.error])
                return
            }

            const { site, group } = socketData
            const data = await db.createGroup(site, group, userData._id)
            if (data.success) {
                let groupID = data._id.toString()
                socket.join(groupID)
                const groupData = {
                    [groupID]: {
                        name: group,
                        members: [userData._id],
                        messages: [{
                            notice: true,
                            event: 'system',
                            timestamp: utcTime(),
                            msg: `You have just created new group ${group} in your project. You can now start adding project members.`
                        }]
                    }
                }
                callback(true, groupData)
                restSocketsJoin(userData._id, socket.id, groupID)
                restSocketsUpdate(userData._id, socket.id, 'create-group', { site, groupData })
            } else {
                callback(false, [data.message])
            }
        })

        socket.on('add-member', async (socketData, addMember) => {
            const validation = validate.membershipData(userData._id, socketData)
            if (validation.failed) return

            const { member, group } = validation.data
            const online = Boolean(userIDToSocketIDCache[member])
            const data = await db.addUserToGroup(member, group, userData._id, online)
            if (data.error) {
                sysLog(data.error)
                return
            }

            const site = data.groupData.site
            const user = {
                _id: data.userData._id,
                name: data.userData.name,
                username: data.userData.username,
                picture: data.userData.picture,
                online
            }
            io.to(group).emit('join-message', { user, site, group })

            if (online) {
                const messages = oldMessagesOnJoin(data.messages)
                messages.push({
                    notice: true,
                    event: 'system',
                    timestamp: utcTime(),
                    msg: `You have been added to ${data.groupData.name} by Admin.`
                })
                const groupData = {
                    [group]: {
                        name: data.groupData.name,
                        members: [...data.groupData.members, data.userData._id],
                        messages,
                        unread: true
                    }
                }
                userIDToSocketIDCache[member].forEach(socket => {
                    io.sockets.sockets.get(socket).join(group)
                    io.sockets.sockets.get(socket).emit('added-to-group', { site, group: groupData })
                })
            }
            addMember() // acknowledgement callback
        })

        socket.on('remove-member', async (socketData, removeMember) => {
            const validation = validate.membershipData(userData._id, socketData)
            if (validation.failed) return

            const { member, group } = validation.data
            const data = await db.removeUserFromGroup(member, group, userData._id)
            if (data.error) {
                sysLog(data.error)
                return
            }

            const { site, groups, event } = data
            if (userIDToSocketIDCache[member]) {
                userIDToSocketIDCache[member].forEach(sid => {
                    groups.forEach(group => {
                        io.sockets.sockets.get(sid).leave(group)
                    })
                    io.sockets.sockets.get(sid).emit(event, { site, groups })
                })
            }
            groups.forEach(group => {
                io.to(group).emit('leave-message', { member, site, group })
            })
            removeMember() // acknowledgement callback
        })

        socket.on('send-invitation', async (socketData, callback) => { //admin
            const validation = validate.userAndSiteId(userData._id, socketData)
            if (validation.failed) return

            const { uid, sid } = validation.data
            const online = Boolean(userIDToSocketIDCache[uid])
            const data = await db.sendInvitation(uid, sid, userData._id)

            if (data.error) {
                sysLog(`Invitation from ${userData._id} to ${uid} for ${sid} failed: ${data.error}`)
                return
            }

            if (online) {
                let siteData = {
                    _id: sid,
                    name: data.site.name
                }
                userIDToSocketIDCache[uid].forEach(socket => {
                    io.to(socket).emit('add-site-to-invitations', siteData)
                })
            }

            let user = {
                _id: data.user._id,
                username: data.user.username,
                name: data.user.name,
                picture: data.user.picture,
                online
            }
            sysLog(`${userData._id} invited ${uid} to join ${sid}`)
            callback(true, { site: sid, user })
            restSocketsUpdate(userData._id, socket.id, 'add-user-to-site-invitations', { site: sid, user })
        })

        socket.on('cancel-invitation', async (socketData, callback) => {
            const validation = validate.userAndSiteId(userData._id, socketData)
            if (validation.failed) return

            const { uid, sid } = validation.data
            const data = await db.cancelInvitation(uid, sid, userData._id)

            if (data.error) {
                sysLog(`${data.error}`)
                return
            }

            userIDToSocketIDCache[userData._id].forEach(socket => {
                io.to(socket).emit('remove-user-from-site-invitations', { uid, sid })
            })

            if (userIDToSocketIDCache[uid]) {
                userIDToSocketIDCache[uid].forEach(socket => {
                    io.to(socket).emit('remove-site-from-invitations', sid)
                })
            }
            sysLog(`Invitation for ${uid} to join ${sid} canceled by admin.`)
            // callback()
        })

        socket.on('accept-request', async (socketData, callback) => { // admin
            const validation = validate.userAndSiteId(userData._id, socketData)
            if (validation.failed) return

            const { uid, sid } = validation.data
            const online = Boolean(userIDToSocketIDCache[uid])

            const data = await db.acceptRequest(uid, sid, userData._id, online)

            if (data.error) {
                sysLog(`${data.error}`)
                return
            }

            const user = {
                _id: data.user._id,
                username: data.user.username,
                name: data.user.name,
                picture: data.user.picture,
                online
            }
            const group = data.group._id.toString()
            io.to(group).emit('join-message', {
                user,
                site: sid,
                group
            })
            // if user is online send him data
            if (online) {
                const associatedUsers = {}
                data.group.members.map(member => associatedUsers[member._id] = {
                    username: member.username,
                    name: member.name,
                    picture: member.picture,
                    online: Boolean(userIDToSocketIDCache[member._id])
                })
                const messages = oldMessagesOnJoin(data.messages)
                messages.push({
                    notice: true,
                    event: 'system',
                    timestamp: utcTime(),
                    msg: `Welcome to ${data.site.name}.`
                })
                const site = {
                    [sid]: {
                        name: data.site.name,
                        creator: data.site.creator,
                        groups: {
                            [group]: {
                                name: data.group.name,
                                members: [...Object.keys(associatedUsers), uid],
                                messages,
                                unread: true
                            }
                        }
                    }
                }

                userIDToSocketIDCache[uid].forEach(socket => {
                    io.sockets.sockets.get(socket).join(group)
                    io.sockets.sockets.get(socket).emit('request-accepted', { site, associatedUsers })
                })

            }
            // callback()
            sysLog(`Join request from ${uid} to join ${sid} accepted by admin.`)
        })

        socket.on('reject-request', async (socketData, callback) => { // admin
            const validation = validate.userAndSiteId(userData._id, socketData)
            if (validation.failed) return

            const { uid, sid } = validation.data
            const data = await db.rejectRequest(uid, sid, userData._id)

            if (data.error) {
                sysLog(`${data.error}`)
                return
            }
            userIDToSocketIDCache[userData._id].forEach(socket => {
                io.to(socket).emit('remove-user-from-site-requests', { uid, sid })
            })

            // emit msg to user to update his pending projects list
            if (userIDToSocketIDCache[uid]) {
                userIDToSocketIDCache[uid].forEach(socket => {
                    io.to(socket).emit('remove-site-from-requests', sid)
                })
            }
            sysLog(`Join request from ${uid} to join ${sid} rejected by admin.`)
            // callback()
        })

        socket.on('send-request', async (sid, callback) => { // user
            const validation = validate.siteId(userData._id, sid)
            if (validation.failed) return

            const data = await db.sendRequest(sid, userData._id)
            if (data.error) {
                sysLog(`Join request from ${userData._id} to ${sid} failed: ${data.error}`)
                return
            }

            if (userIDToSocketIDCache[data.site.creator]) {
                const user = {
                    picture: userData.picture,
                    username: userData.username,
                    name: userData.name,
                    _id: userData._id,
                    online: true
                }
                userIDToSocketIDCache[data.site.creator].forEach(socket => {
                    io.to(socket).emit('add-user-to-site-requests', { site: sid, user })
                })
            }

            const site = {
                _id: data.site._id,
                name: data.site.name
            }
            userIDToSocketIDCache[userData._id].forEach(socket => {
                io.to(socket).emit('add-site-to-requests', site)
            })
            sysLog(`${userData._id} request to join ${sid}`)
            // callback(true, site)
            // restSocketsUpdate(userData._id, socket.id, 'add-site-to-requests', site)
        })

        socket.on('cancel-request', async (sid, callback) => { // user
            const validation = validate.siteId(userData._id, sid)
            if (validation.failed) return

            const data = await db.cancelRequest(sid, userData._id)
            if (data.error) {
                sysLog(`${data.error}`)
                return
            }

            if (userIDToSocketIDCache[data.site.creator]) {
                userIDToSocketIDCache[data.site.creator].forEach(socket => {
                    io.to(socket).emit('remove-user-from-site-requests', { uid: userData._id, sid })
                })
            }

            userIDToSocketIDCache[userData._id].forEach(socket => {
                io.to(socket).emit('remove-site-from-requests', sid)
            })
            sysLog(`Join request from ${userData._id} to ${sid} canceled by user.`)
            // callback()
        })

        socket.on('accept-invitation', async (sid, callback) => {
            const validation = validate.siteId(userData._id, sid)
            if (validation.failed) return

            const data = await db.acceptInvitation(sid, userData._id)
            if (data.error) {
                sysLog(`Join attempt from ${userData._id} to ${sid} failed: ${data.error}`)
                return
            }

            let user = {
                _id: userData._id,
                username: userData.username,
                name: userData.name,
                picture: userData.picture,
                online: true
            }
            let group = data.group._id.toString()
            socket.join(group)
            socket.to(group).emit('join-message', {
                user,
                site: sid,
                group
            })

            let associatedUsers = {}
            data.group.members.map(member => associatedUsers[member._id] = {
                username: member.username,
                name: member.name,
                picture: member.picture,
                online: Boolean(userIDToSocketIDCache[member._id])
            })
            let messages = oldMessagesOnJoin(data.messages)
            messages.push({
                notice: true,
                event: 'system',
                timestamp: utcTime(),
                msg: `Welcome to ${data.site.name}.`
            })
            let siteData = {
                [sid]: {
                    name: data.site.name,
                    creator: data.site.creator,
                    groups: {
                        [group]: {
                            name: 'General',
                            members: [...Object.keys(associatedUsers), userData._id],
                            messages,
                            // unread: true
                        }
                    }
                }
            }

            sysLog(`${userData._id} accepted invitation and joined ${sid}`)
            callback(true, { siteData, associatedUsers })
            restSocketsJoin(userData._id, socket.id, group)
            restSocketsUpdate(userData._id, socket.id, 'invitation-accepted', { siteData, associatedUsers })
        })

        socket.on('reject-invitation', async (sid, callback) => {
            const validation = validate.siteId(userData._id, sid)
            if (validation.failed) return

            const data = await db.rejectInvitation(sid, userData._id)
            if (data.error) {
                sysLog(`${data.error}`)
                return
            }

            if (userIDToSocketIDCache[data.site.creator]) {
                userIDToSocketIDCache[data.site.creator].forEach(socket => {
                    io.to(socket).emit('remove-user-from-site-invitations', { uid: userData._id, sid })
                })
            }
            userIDToSocketIDCache[userData._id].forEach(socket => {
                io.to(socket).emit('remove-site-from-invitations', sid)
            })
            sysLog(`Invitation for ${userData._id} to join ${sid} rejected by user.`)
            // callback()
        })

        socket.on('search-projects', async (socketData, callback) => {
            const validation = validate.siteSearch(userData._id, socketData)
            if (validation.failed) {
                callback(false, validation.error) // send validation.errors if applicable
                return
            }
            const { site, page } = validation.data
            const data = await db.searchProjects(userData._id, site, page)
            if (data.success) {
                callback(true, data.more, data.projects)
            } else {
                callback(false, false, 'No results found')
            }
        })

        socket.on('search-people', async (socketData, callback) => {
            const validation = validate.peopleSearch(userData._id, socketData)
            if (validation.failed) {
                callback(false, validation.error) // send validation.errors if applicable
                return
            }
            const { name, page } = validation.data
            const data = await db.searchPeople(name, page)
            if (data.success) {
                callback(true, data.people)
            } else {
                callback(false, 'No results found')
            }
        })

        socket.on('update-profile-data', async (socketData, callback) => {
            // add timing validaton ?
            const validation = validate.profileData(userData._id, socketData)
            if (validation.failed) {
                // callback() // send validation.errors if applicable
                return
            }
            const data = await db.updateProfileData(userData._id, validation.data)
            const onlineUsers = new Set()
            socket.rooms.forEach(room => {
                io.sockets.adapter.rooms.get(room).forEach(sid => {
                    onlineUsers.add(sid)
                })
            })

            userIDToSocketIDCache[userData._id].forEach(sid => onlineUsers.delete(sid))
            onlineUsers.forEach(sid => {
                io.to(sid).emit('profile-update',
                    {
                        _id: userData._id,
                        data
                    }
                )
            })
            callback(validation.data)
            restSocketsUpdate(userData._id, socket.id, 'update-profile-data', validation.data)
        })

        socket.on('update-project-settings', async (socketData, callback) => {
            const validation = validate.siteData(userData._id, socketData)
            if (validation.failed) {
                callback(false, validation.error) // send validation.errors if applicable
                return
            }

            const { sid, site, description, logo } = validation.data
            const data = await db.updateProjectSettings(userData._id, sid, site, description, logo)

            if (data.error) {
                sysLog(data.error)
                if (data.userErrors) callback(false, ...data.userErrors)
                return
            }
            
            const siteData = {
                sid: data.site._id,
                name: data.site.name,
                description: data.site.description,
                logo: data.site.logo
            }
            callback(true, siteData)
            // todo 
            // update rest sockets and send changes to users associated with project
        })

        socket.on('get-chat-history', async (id, callback) => {
            const data = await db.getPrivateMessages(id, userData._id)
            const chat = {
                messages: []
            }
            if (data) {
                chat.username = data.username
                data.messages.forEach(msg => {
                    chat.messages.push({
                        src: msg.source._id,
                        msg: msg.content,
                        type: msg.type || 'plain',
                        timestamp: msg.createdAt
                    })
                })
            }
            callback(chat)
        })

        socket.on('get-user-details', async (userId, callback) => {
            const userDetails = await db.getUserDetails(userId)
            callback(userDetails)
        })

        socket.on('change-theme', async theme => {
            const allowedThemes = ['light', 'dark'] // move validation in validate-socket-data
            if (!allowedThemes.includes(theme)) return // log attempt and return
            await db.changeTheme(userData._id, theme)
        })

        // socket.on('update-atime', async(gid, callback) => {
        //     const atime = await db.updateAccessTime(userData._id, gid)
        //     callback()
        // })
    })

    function oldMessagesOnJoin(messagesData) {
        let messages = []
        messagesData.forEach(msg => {
            messages.push({
                src: msg.source._id,
                msg: msg.content,
                type: msg.type || 'plain',
                timestamp: msg.createdAt
            })
        })
        return messages
    }

    function restSocketsUpdate(uid, sid, event, data) {
        // update rest connections when connected from multiply devices
        userIDToSocketIDCache[uid].forEach(socket => {
            if (socket !== sid) io.to(socket).emit(event, data)
        })
    }

    function restSocketsJoin(uid, sid, gid) {
        // join rest connections when connected from multiply devices
        userIDToSocketIDCache[uid].forEach(socket => {
            if (socket !== sid) io.sockets.sockets.get(socket).join(gid)
        })
    }
}

function getTime() {
    return new Date().toLocaleTimeString()
}

function utcTime() {
    return new Date().toUTCString()
}

function sysLog(message) {
    console.log(`[${getTime()}] ${message}`)
}
