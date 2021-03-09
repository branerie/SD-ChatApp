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
                    io.to(sid).emit('online-message', {
                        user: {
                            _id: userData._id,
                            name: userData.name,
                            username: userData.username,
                            picture: userData.picture,
                            online: true
                        }
                    })
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
                    io.to(sid).emit('quit-message', {
                        user: {
                            _id: userData._id,
                            name: userData.name,
                        }
                    })
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
                return
            }

            sysLog(`Message (group): ${userData._id} >> ${dst}`)
            socket.to(dst).emit('group-chat-message', { src, msg, type, dst, site: newMessage.site })
            callback()
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

        socket.on('send-invitation', async ({ user, site }, callback) => { //admin
            const data = await db.inviteUser(user, site, userData._id)
            if (data.success) {
                data.userData.online = Boolean(userIDToSocketIDCache[data.userData._id])
                if (data.userData.online) {
                    userIDToSocketIDCache[data.userData._id].forEach(socketID => {
                        io.to(socketID).emit('add-site-to-invitations', data.siteData)
                    })
                }
                sysLog(`${userData.username} invited ${user} to join ${site}`)
                callback(true, data.userData)
                restSocketsUpdate(userData._id, socket.id, 'add-user-to-site-invitations', { site, user: data.userData })
            } else {
                sysLog(`Invitation from ${userData.username} to ${user} for ${site} failed: ${data}`)
            }
        })

        socket.on('send-request', async (site, callback) => { // user
            const data = await db.sendRequest(site, userData._id)
            if (data.success) {
                if (userIDToSocketIDCache[data.site.creator]) {
                    const user = {
                        picture: userData.picture,
                        username: userData.username,
                        name: userData.name,
                        _id: userData._id,
                        online: true
                    }
                    userIDToSocketIDCache[data.site.creator].forEach(socket => {
                        io.to(socket).emit('add-user-to-site-requests', { site, user })
                    })
                }
                const siteData = {
                    _id: data.site._id,
                    name: data.site.name
                }
                sysLog(`${userData._id} request to join ${site}`)
                callback(true, siteData)
                restSocketsUpdate(userData._id, socket.id, 'add-site-to-requests', siteData)
            } else {
                sysLog(`Join request from ${userData._id} to ${site} failed: ${data.error}`)
            }

        })

        socket.on('accept-invitation', async (site, callback) => {
            const data = await db.acceptInvitation(site, userData._id)
            if (data.success) {
                let user = {
                    _id: userData._id,
                    username: userData.username,
                    name: userData.name,
                    picture: userData.picture,
                    online: true
                }
                let group = data.generalGroup._id.toString()
                socket.join(group)
                socket.to(group).emit('join-message', {
                    user,
                    site,
                    group
                })

                let associatedUsers = {}
                data.generalGroup.members.map(member => associatedUsers[member._id] = {
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
                    [site]: {
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

                sysLog(`${userData.username} accepted invitation and joined ${data.site.name}`)
                callback(true, { siteData, associatedUsers })
                restSocketsJoin(userData._id, socket.id, group)
                restSocketsUpdate(userData._id, socket.id, 'invitation-accepted', { siteData, associatedUsers })
            }
            else {
                sysLog(`Join attempt from ${userData.username} to ${site} failed: ${data}`)
            }
        })

        socket.on('accept-request', async ({ user, site }, callback) => { // admin
            const data = await db.acceptRequest(site, user, userData._id)
            if (data.success) {
                let online = userIDToSocketIDCache[user] ? true : false
                let userData = {
                    _id: data.userData._id,
                    username: data.userData.username,
                    name: data.userData.name,
                    picture: data.userData.picture,
                    online
                }
                let group = data.generalGroup._id.toString()
                io.to(group).emit('join-message', {
                    user: userData,
                    site,
                    group
                })
                // if user is online send him data
                if (online) {
                    let associatedUsers = {}
                    data.generalGroup.members.map(member => associatedUsers[member._id] = {
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
                        [site]: {
                            name: data.site.name,
                            creator: data.site.creator,
                            groups: {
                                [group]: {
                                    name: data.generalGroup.name,
                                    members: [...Object.keys(associatedUsers), user],
                                    messages,
                                    unread: true
                                }
                            }
                        }
                    }

                    userIDToSocketIDCache[user].forEach(socket => {
                        io.sockets.sockets.get(socket).join(group)
                        io.sockets.sockets.get(socket).emit('request-accepted', { site: siteData, associatedUsers })
                    })

                }
                // callback()
                sysLog(`Join request from ${user} to join ${site} accepted by admin.`)
            }
        })

        socket.on('add-member', async ({ member, site, group }, callback) => {
            if (member === '') return // stop this on client side also
            const data = await db.addUserToGroup(member, site, group, userData._id)
            if (data.success) {
                let online = userIDToSocketIDCache[member] ? true : false
                console.log(online);
                let user = {
                    _id: data.userData._id,
                    name: data.userData.name,
                    username: data.userData.username,
                    picture: data.userData.picture,
                    online
                }
                io.to(group).emit('join-message', {
                    user,
                    site,
                    group
                })

                if (online) {
                    let messages = oldMessagesOnJoin(data.messages)
                    messages.push({
                        notice: true,
                        event: 'system',
                        timestamp: utcTime(),
                        msg: `You have been added to ${data.groupData.name} by Admin.`
                    })
                    let groupData = {
                        [group]: {
                            name: data.groupData.name,
                            members: [...data.groupData.members.map(m => m._id), data.userData._id],
                            messages, // get old msgs from db ? 
                            unread: true
                        }
                    }
                    userIDToSocketIDCache[member].forEach(socket => {
                        io.sockets.sockets.get(socket).join(group)
                        io.sockets.sockets.get(socket).emit('added-to-group', { site, group: groupData })
                    })
                }
                callback()
            }
        })

        socket.on('remove-member', async ({ member, site, group }, callback) => {
            if (member === '') return // stop this on client side also
            const data = await db.removeUserFromGroup(member, site, group, userData._id)
            if (data.success) {
                if (userIDToSocketIDCache[member]) {
                    userIDToSocketIDCache[member].forEach(socket => {
                        io.sockets.sockets.get(socket).leave(group)
                        io.sockets.sockets.get(socket).emit('removed-from-group', { site, group })
                    })
                }
                io.to(group).emit('leave-message', { member, site, group })
                callback()
            }
        })

        socket.on('reject-invitation', async (site, callback) => {
            const data = await db.rejectInvitation(site, userData._id)
            if (data.success) {
                userIDToSocketIDCache[userData._id].forEach(socket => {
                    io.to(socket).emit('remove-site-from-invitations', site)
                })

                // emit msg to admin to update project pending members list
                if (userIDToSocketIDCache[data.site.creator]) {
                    userIDToSocketIDCache[data.site.creator].forEach(socket => {
                        io.to(socket).emit('remove-user-from-site-invitations', { user: userData._id, site })
                    })
                }
            }
            sysLog(`Invitation for ${userData._id} to join ${site} rejected by user.`)
            // callback()
        })

        socket.on('cancel-invitation', async ({ user, site }, callback) => {
            // check site creator and user id from socket
            const data = await db.cancelInvitation(site, user, userData._id)
            if (data.success) {
                userIDToSocketIDCache[userData._id].forEach(socket => {
                    io.to(socket).emit('remove-user-from-site-invitations', { user, site })
                })

                // emit msg to user to update his pending projects list
                if (userIDToSocketIDCache[user]) {
                    userIDToSocketIDCache[user].forEach(socket => {
                        io.to(socket).emit('remove-site-from-invitations', site)
                    })
                }
            }
            sysLog(`Invitation for ${user} to join ${site} canceled by admin.`)
            // callback()
        })

        socket.on('reject-request', async ({ user, site }, callback) => { // admin
            const data = await db.rejectRequest(site, user, userData._id)
            if (data.success) {
                userIDToSocketIDCache[userData._id].forEach(socket => {
                    io.to(socket).emit('remove-user-from-site-requests', { user, site })
                })

                // emit msg to user to update his pending projects list
                if (userIDToSocketIDCache[user]) {
                    userIDToSocketIDCache[user].forEach(socket => {
                        io.to(socket).emit('remove-site-from-requests', site)
                    })
                }
            }
            sysLog(`Join request from ${user} to join ${site} rejected by admin.`)
            // callback()
        })

        socket.on('cancel-request', async (site, callback) => { // user
            const data = await db.cancelRequest(site, userData._id)
            if (data.success) {
                userIDToSocketIDCache[userData._id].forEach(socket => {
                    io.to(socket).emit('remove-site-from-requests', site)
                })

                // emit msg to admin to update project pending members list
                if (userIDToSocketIDCache[data.site.creator]) {
                    userIDToSocketIDCache[data.site.creator].forEach(socket => {
                        io.to(socket).emit('remove-user-from-site-requests', { user: userData._id, site })
                    })
                }
            }
            sysLog(`Join request from ${userData._id} to ${site} canceled by user.`)
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
                io.to(sid).emit('profile-update', {
                    user: {
                        _id: userData._id,
                        data
                    }
                })
            })
            callback(validation.data)
            restSocketsUpdate(userData._id, socket.id, 'update-profile-data', validation.data)
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
