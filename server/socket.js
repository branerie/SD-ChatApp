const jwt = require('./utils/jwt')
const vsd = require('./utils/validate-socket-data')
const db = require('./db/query')
const cookie = require("cookie")
const createUserData = require('./utils/createUserData')

module.exports = io => {
    // cache keeps track of connected users by id and their assigned socket id
    // it is updated on every connect and disconnect 
    let userIDToSocketIDCache = {}
    let groupToSiteCache = {}

    let socketsCount = 0
    let clientsCount = 0

    io.on("connect", async (socket) => {
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
        if (userIDToSocketIDCache[userData._id].length === 1) clientsCount++
        socketsCount++
        sysLog(`Connect @ ${socket.id} (${userData.username}). Total clients/connections in pool: ${clientsCount}/${socketsCount}.`)


        const { clientData, allMembers, siteCache } = createUserData(userData, messagePool)
        groupToSiteCache = { ...groupToSiteCache, ...siteCache }

        userData.groups.forEach(({ _id, site }) => {
            _id = _id.toString()
            socket.join(_id)
            // send online status if first connection 
            if (userIDToSocketIDCache[userData._id].length === 1) {
                socket.to(_id).emit("online-message", {
                    user: {
                        _id: userData._id,
                        name: userData.name,
                        username: userData.username,
                        online: true
                    },
                    site: site._id,
                    group: _id
                })
            }
        })

        clientData.onlineMembers = getOnlineMembers(allMembers)
        allMembers.forEach(member => clientData.associatedUsers[member].online = Boolean(userIDToSocketIDCache[member]))
        // console.log(JSON.stringify(clientData, null, 4),"\n","clientData END")
        socket.emit("welcome-message", { userData: clientData })

        // EVENT LISTENERS SECTION
        // Notify users on disconnect
        socket.on("disconnecting", (reason) => {
            userIDToSocketIDCache[userData._id] = userIDToSocketIDCache[userData._id].filter(s => s !== socket.id)
            socketsCount--

            // send offline status if last connection
            if (userIDToSocketIDCache[userData._id].length === 0) {
                delete userIDToSocketIDCache[userData._id]
                clientsCount--
                socket.rooms.forEach(group => {
                    socket.to(group).emit("quit-message", {
                        user: {
                            _id: userData._id,
                            name: userData.name,
                            username: userData.username,
                            online: false
                        },
                        reason,
                        group,
                        site: groupToSiteCache[group]
                    })
                })
            }
            sysLog(`Disconnect @ ${socket.id} (${userData.username}). Reason: ${reason}. Total clients/connections in pool: ${clientsCount}/${socketsCount}.`)
        })

        socket.on('disconnect', () => {
            socket.removeAllListeners()
        })

        // Get message from client and send to rest clients
        socket.on("group-chat-message", async ({ msg, recipient, site }, callback) => {
            let newMessage = await db.createPublicMessage(userData._id, recipient, msg)
            if (!newMessage) return // validate query
            sysLog(`Message (group): ${userData.username} >> ${recipient}`)
            socket.to(recipient).emit("group-chat-message", { user: userData._id.toString(), msg, group: recipient, site })
            callback()
        })

        socket.on("single-chat-message", async ({ msg, recipient }, callback) => {
            let newMessage = await db.createPrivateMessage(userData._id, recipient, msg)
            if (!newMessage) return // validate query            

            // send message to all sockets associated with recipient if any
            if (userIDToSocketIDCache[recipient]) {
                sysLog(`Message (private): ${userData.username} >> ${recipient}`)
                userIDToSocketIDCache[recipient].forEach(socketID => {
                    io.to(socketID).emit("single-chat-message", {
                        user: userData.name,
                        username: userData.username,
                        chat: userData._id,
                        msg,
                        own: recipient === userData._id.toString()
                    })
                })
            } else {
                // send offline msg to DB if not in blacklist
                sysLog(`Message (offline): ${userData.username} >> ${recipient}`)
            }
            if (recipient !== userData._id.toString()) restSocketsUpdate(userData._id, socket.id, "single-chat-message", { user: userData._id, chat: recipient, msg, own: true })
            callback()
        })

        socket.on("close-chat", async chat => {
            await db.removeChat(userData._id, chat)
        })

        socket.on('create-site', async (socketData, callback) => { //admin
            if (!isValid(socketData, userData._id)) return
            let { site = '', description = '' } = socketData
            site = String(site).trim()
            description = String(description).trim()
            const check = vsd.siteData(site, description)
            if (check.failed) {
                callback(false, check.errors)
                return
            }
            const data = await db.createSite(site, description, userData._id)
            if (data.success) {
                let groupID = data.groupID.toString()
                groupToSiteCache[groupID] = data.siteID
                socket.join(groupID)
                const siteData = {
                    [data.siteID]: {
                        name: site,
                        creator: userData._id,
                        groups: {
                            [groupID]: {
                                name: 'General',
                                members: [userData._id],
                                // members: [{
                                //     _id: userData._id,
                                //     name: userData.name,
                                //     username: userData.username
                                // }],
                                messages: [{
                                    user: 'SERVER',
                                    timestamp: utcTime(),
                                    msg: `Hello ${userData.name}. Welcome to your new project: ${site}. You can invite members in General group or start creating groups now.`,
                                    own: false
                                }]
                            }
                        }
                    }
                }
                callback(true, siteData)
                restSocketsJoin(userData._id, socket.id, groupID)
                restSocketsUpdate(userData._id, socket.id, "create-site", siteData)
            } else {
                callback(false, data.errors)
            }
        })

        socket.on('create-group', async ({ site, group }, callback) => { //admin
            if (group === undefined) {
                // Avoid db query but validate it in the schema with required flag. Also set this check on Client Side.
                sysLog(`${userData._id} @ ${socket.id} attempt to create group with no name in ${site}`)
                callback(false, 'Group name is required')
                return
            }

            if (group.toLowerCase() === 'general') {
                // Avoid db query. Also set this check on Client Side.
                sysLog(`${userData._id} @ ${socket.id} attempt to create General group in ${site}`)
                callback(false, 'General is reserved name')
                return
            }
            const data = await db.createGroup(site, group, userData._id)
            if (data.success) {
                let groupID = data._id.toString()
                groupToSiteCache[groupID] = site
                socket.join(groupID)
                const groupData = {
                    [groupID]: {
                        name: group,
                        members: [userData._id],
                        // members: [{
                        //     _id: userData._id,
                        //     name: userData.name,
                        //     username: userData.username
                        // }],
                        messages: [{
                            user: 'SERVER',
                            timestamp: utcTime(),
                            msg: `You have just created new group ${group} in your project. You can now start adding project members.`,
                            own: false
                        }]
                    }
                }
                callback(true, groupData)
                restSocketsJoin(userData._id, socket.id, groupID)
                restSocketsUpdate(userData._id, socket.id, "create-group", { site, groupData })
            } else {
                callback(false, data.message)
            }
        })

        socket.on("send-invitation", async ({ user, site }, callback) => { //admin
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
                restSocketsUpdate(userData._id, socket.id, "add-user-to-site-invitations", { site, user: data.userData })
            } else {
                sysLog(`Invitation from ${userData.username} to ${user} for ${site} failed: ${data}`)
            }
        })

        socket.on("send-request", async (site, callback) => { // user
            const data = await db.sendRequest(site, userData._id)
            let user = {
                picture: userData.picture,
                username: userData.username,
                name: userData.name,
                _id: userData._id,
                online: true
            }
            if (data.success) {
                if (userIDToSocketIDCache[data.site.creator]) {
                    userIDToSocketIDCache[data.site.creator].forEach(socket => {
                        io.to(socket).emit('add-user-to-site-requests', { site: data.site._id, user })
                    })
                }
                sysLog(`${userData.username} request to join ${site}`)
                callback(true, { _id: data.site._id, name: data.site.name })
                restSocketsUpdate(userData._id, socket.id, 'add-site-to-requests', { _id: data.site._id, name: data.site.name })
            } else {
                sysLog(`Join request from ${userData.username} to ${site} failed: ${data}`)
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
                groupToSiteCache[group] = site
                socket.join(group)
                socket.to(group).emit("join-message", {
                    user,
                    online: true,
                    site,
                    group
                })
                let memberIDs = data.generalGroup.members.map(m => m._id)
                let associatedUsers = {}
                data.generalGroup.members.map(member => associatedUsers[member._id] = {
                    username: member.username,
                    name: member.name,
                    picture: member.picture
                })
                let siteData = {
                    [site]: {
                        name: data.site.name,
                        creator: data.site.creator,
                        groups: {
                            [group]: {
                                name: 'General',
                                members: [...memberIDs, userData._id],
                                // members: [
                                //     ...data.generalGroup.members,
                                //     user
                                // ],
                                messages: []
                            }
                        }
                    }
                }
                let onlineMembers = getOnlineMembers(memberIDs)
                memberIDs.forEach(m => associatedUsers[m].online = Boolean(userIDToSocketIDCache[m]))

                sysLog(`${userData.username} accepted invitation and joined ${data.site.name}`)
                callback(true, { siteData, associatedUsers, onlineMembers })
                restSocketsJoin(userData._id, socket.id, group)
                restSocketsUpdate(userData._id, socket.id, "invitation-accepted", { siteData, associatedUsers, onlineMembers })
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
                groupToSiteCache[group] = site
                io.to(group).emit("join-message", {
                    user: userData,
                    online,
                    site,
                    group
                })
                // if user is online send him data
                if (online) {
                    let associatedUsers = {}
                    let memberIDs = data.generalGroup.members.map(m => m._id)
                    data.generalGroup.members.map(member => associatedUsers[member._id] = {
                        username: member.username,
                        name: member.name,
                        picture: member.picture
                    })
                    let siteData = {
                        [site]: {
                            name: data.site.name,
                            creator: data.site.creator,
                            groups: {
                                [group]: {
                                    name: data.generalGroup.name,
                                    members: [...memberIDs, user],
                                    // members: [
                                    //     ...data.generalGroup.members,
                                    //     user
                                    // ],
                                    messages: []
                                }
                            }
                        }
                    }
                    let onlineMembers = getOnlineMembers(memberIDs)
                    memberIDs.forEach(m => associatedUsers[m].online = Boolean(userIDToSocketIDCache[m]))

                    userIDToSocketIDCache[user].forEach(socket => {
                        io.sockets.sockets.get(socket).join(group)
                        io.sockets.sockets.get(socket).emit('request-accepted', { site: siteData, associatedUsers, onlineMembers })
                    })

                }
                // callback()
                sysLog(`Join request from ${user} to join ${site} accepted by admin.`)
            }
        })

        socket.on('add-member', async ({ member, site, group }) => {
            if (member === '') return // stop this on client side also
            const data = await db.addUserToGroup(member, site, group, userData._id)
            if (data.success) {
                let online = userIDToSocketIDCache[member] ? true : false
                let user = {
                    _id: data.userData._id,
                    name: data.userData.name,
                    username: data.userData.username,
                    picture: data.userData.picture,
                    online
                }
                io.to(group).emit("join-message", {
                    user,
                    online,
                    site,
                    group
                })

                if (online) {
                    let groupData = {
                        [group]: {
                            name: data.groupData.name,
                            members: [...data.groupData.members.map(m => m._id), data.userData._id],
                            // members: [
                            //     ...data.groupData.members,
                            //     user
                            // ],
                            messages: []
                        }
                    }
                    console.log(groupData);
                    userIDToSocketIDCache[member].forEach(socket => {
                        io.sockets.sockets.get(socket).join(group)
                        io.sockets.sockets.get(socket).emit('added-to-group', { site, group: groupData })
                    })
                }
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
            if (!isValid(socketData, userData._id)) return
            const {site = '', page = 0 } = socketData
            const data = await db.searchProjects(site, page)
            if (data.success) {
                callback(true, data.projects)
            } else {
                callback(false)
            }
        })

        socket.on('update-profile-data', async (data, callback) => {
            //move this to middleware
            if (!data || data.constructor.name !== 'Object') {
                sysLog(`Invalid data from ${userData._id} Expected Object - got ${data.constructor.name}.`)
                return
            }
            const allowedFields = ['name', 'company', 'position', 'email', 'mobile', 'picture']
            const ignoredData = {}
            let invalidData = false
            for (const field in data) {
                if (!allowedFields.includes(field)) {
                    ignoredData[field] = data[field]
                    invalidData = true
                    delete data[field]
                }
            }
            invalidData && sysLog(`Unexpected data from ${userData._id}.\nIgnored data: ${JSON.stringify(ignoredData)}.`)
            const newProfileData = await db.updateProfileData(userData._id, data)
            callback(data)
            // if name is changed send newProfileData.name to connected rooms and users via socket? 
        })

        socket.on('get-user-details', async (userId, callback) => {
            const userDetails = await db.getUserDetails(userId)
            callback(true, userDetails)
        })
    })

    // function getGroupMembers(group, members) {
    //     members = members.map(member => member.username)
    //     const onlineSIDs = io.sockets.adapter.rooms.get(group) || new Set()
    //     const online = [...onlineSIDs].map(sid => io.sockets.sockets.get(sid).username)
    //     const offline = members.filter(member => !online.includes(member))
    //     return { online, offline }
    // }

    function getOnlineMembers(members) {
        return members.filter(m => userIDToSocketIDCache[m])
    }

    function restSocketsUpdate(uid, sid, event, data) {
        // update rest connections when connected from multiply devices
        if (userIDToSocketIDCache[uid].length > 1) {
            let restSockets = userIDToSocketIDCache[uid].filter(socket => socket !== sid)
            restSockets.forEach(socket => {
                io.to(socket).emit(event, data)
            })
        }
    }

    function restSocketsJoin(uid, sid, gid) {
        // join rest connections when connected from multiply devices
        if (userIDToSocketIDCache[uid].length > 1) {
            let restSockets = userIDToSocketIDCache[uid].filter(socket => socket !== sid)
            restSockets.forEach(socket => {
                io.sockets.sockets.get(socket).join(gid)
            })
        }
    }
}

function isValid(object, source) {
    if (object == null || object == undefined) {
        sysLog(`Invalid data from ${source} Expected Object - got ${object}`)
        return false
    } else if (!object || object.constructor.name !== 'Object') {
        sysLog(`Invalid data from ${source} Expected Object - got ${object.constructor.name}.`)
        return false
    } else return true
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
