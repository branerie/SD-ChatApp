const jwt = require('./utils/jwt')
const db = require('./db/query')
const cookie = require("cookie")
const site = require('./models/site')

module.exports = io => {
    // cache keeps track of connected users by id and their assigned socket id
    // it is updated on every connect and disconnect 
    const userIDToSocketIDCache = {}
    const groupToSiteCache = {}

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
        // console.log(JSON.stringify(userData, null, 4))

        const reactUserData = {
            sites: {},
            chats: {},
            personal: {
                username: userData.username,
                _id: userData._id
            }
        }
        if (userData.invitations) reactUserData.invitations = userData.invitations
        if (userData.requests) reactUserData.requests = userData.requests
        const allMembers = new Set([userData._id])

        userIDToSocketIDCache[userData._id] = [...userIDToSocketIDCache[userData._id] || [], socket.id]
        if (userIDToSocketIDCache[userData._id].length === 1) clientsCount++
        socketsCount++
        sysLog(`Connect @ ${socket.id} (${userData.username}). Total clients/connections in pool: ${clientsCount}/${socketsCount}.`)

        socket.username = userData.username // save username for a later use

        userData.groups.forEach(({ _id, name, site, members }) => {
            members.map(m => allMembers.add(m._id))
            groupToSiteCache[_id] = site._id
            if (!reactUserData.sites[site._id]) {
                reactUserData.sites[site._id] = {
                    name: site.name,
                    creator: site.creator,
                    groups: {}
                }
                if (site.creator.toString() === userData._id.toString()) {
                    reactUserData.sites[site._id].invitations = site.invitations || []
                    reactUserData.sites[site._id].requests = site.requests || []
                }
            }
            reactUserData.sites[site._id].groups[_id] = {
                name,
                members,
                messages: []
            }
        })

        let messagePool = await db.getMessages(userData)
        messagePool.forEach(msg => {
            switch (msg.onModel) {
                case "User":
                    // determine who is the other party in conversation
                    let partyID = msg.source._id.toString() === userData._id.toString() ? msg.destination._id.toString() : msg.source._id.toString()
                    let partyName = msg.source.username === userData.username ? msg.destination.username : msg.source.username
                    if (!reactUserData.chats[partyID]) {
                        reactUserData.chats[partyID] = {
                            username: partyName,
                            messages: []
                        }
                    }
                    reactUserData.chats[partyID].messages.push({
                        user: msg.source.username,
                        msg: msg.content,
                        timestamp: msg.createdAt
                    })
                    break;

                case "Group":
                    reactUserData.sites[groupToSiteCache[msg.destination._id]].groups[msg.destination._id].messages.push({
                        user: msg.source.username,
                        msg: msg.content,
                        timestamp: msg.createdAt
                    })
                    break;

                default:
                    break;
            }
        })

        userData.groups.forEach(({ _id, site }) => {
            _id = _id.toString()
            socket.join(_id)
            // send online status if first connection 
            if (userIDToSocketIDCache[userData._id].length === 1) {
                socket.to(_id).emit("online-message", {
                    user: {
                        _id: userData._id,
                        username: userData.username
                    },
                    site: site._id,
                    group: _id
                })
            }
        })
        reactUserData.onlineMembers = getOnlineMembers([...allMembers])
        // console.log(JSON.stringify(reactUserData, null, 4),"\n","reactUserData END")
        socket.emit("welcome-message", { userData: reactUserData })

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
                            username: userData.username
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
            socket.to(recipient).emit("group-chat-message", { user: userData.username, msg, group: recipient, site })
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
                        user: userData.username,
                        chat: userData._id,
                        msg
                    })
                })
            } else {
                // send offline msg to DB if not in blacklist
                sysLog(`Message (offline): ${userData.username} >> ${recipient}`)
            }
            restSocketsUpdate(userData._id, socket.id, "single-chat-message", { user: userData.username, chat: recipient, msg })
            callback()
        })

        socket.on("close-chat", async (recipient) => {
            await db.removeChat(userData._id, recipient)
        })

        socket.on('create-site', async (site, callback) => {
            const request = await db.createSite(site, userData._id)
            if (request.success) {
                let groupID = request.groupID.toString()
                groupToSiteCache[groupID] = request.siteID
                socket.join(groupID)
                const siteData = {
                    [request.siteID]: {
                        name: site,
                        creator: userData._id,
                        groups: {
                            [groupID]: {
                                name: 'General',
                                members: [{
                                    _id: userData._id,
                                    username: userData.username,
                                }],
                                messages: [{
                                    user: 'SERVER',
                                    timestamp: getTime(),
                                    msg: `Hello ${userData.username}. Welcome to your new project: ${site}. You can invite members in General group or start creating groups now.`
                                }]
                            }
                        }
                    }
                }
                callback(true, siteData)
                restSocketsJoin(userData._id, socket.id, groupID)
                restSocketsUpdate(userData._id, socket.id, "create-site", siteData)
            } else {
                callback(false, request.message)
            }
        })

        socket.on('create-group', async ({ site, group }, callback) => {
            if (group === undefined) {
                // Avoid db query but validate it in the schema with required flag. Also set this check on Client Side.
                sysLog(`${userData._id} @ ${socket.id} attempt to create group with no name in ${site}`)
                callback(false, 'Group name is required')
                return
            }

            if (group === 'General') {
                // Avoid db query. Also set this check on Client Side.
                sysLog(`${userData._id} @ ${socket.id} attempt to create General group in ${site}`)
                callback(false, 'General is reserved name')
                return
            }
            const request = await db.createGroup(site, group, userData._id)
            if (request.success) {
                let groupID = request._id.toString()
                groupToSiteCache[groupID] = site
                socket.join(groupID)
                const groupData = {
                    [groupID]: {
                        name: group,
                        members: [{
                            _id: userData._id,
                            username: userData.username,
                        }],
                        messages: [{
                            user: 'SERVER',
                            timestamp: getTime(),
                            msg: `You have just created new group ${group} in your project. You can now start adding project members.`
                        }]
                    }
                }
                callback(true, groupData)
                restSocketsJoin(userData._id, socket.id, groupID)
                restSocketsUpdate(userData._id, socket.id, "create-group", { site, groupData })
            } else {
                callback(false, request.message)
            }
        })

        socket.on("invite-user", async ({ user, site }, callback) => {
            const inviteData = await db.inviteUser(user, site, userData._id)
            if (inviteData.success) {
                if (userIDToSocketIDCache[inviteData.userData._id]) {
                    userIDToSocketIDCache[inviteData.userData._id].forEach(socketID => {
                        io.to(socketID).emit('invite-message', inviteData.siteData)
                    })
                }
                sysLog(`${userData.username} invited ${user} to join ${site}`)
                callback(true, inviteData.userData)
                restSocketsUpdate(userData._id, socket.id, "invite-user", { site, user: inviteData.userData })
            } else {
                sysLog(`Invitation from ${userData.username} to ${user} for ${site} failed: ${inviteData}`)
            }
        })

        socket.on('add-member', async ({ member, site, group }) => {
            if (member === '') return // stop this on client side also
            const memberData = await db.addUserToGroup(member, site, group, userData._id)
            if (memberData.success) {
                let online = userIDToSocketIDCache[member] ? true : false
                let user = {
                    _id: memberData.userData._id,
                    username: memberData.userData.username
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
                            name: memberData.groupData.name,
                            members: [
                                ...memberData.groupData.members,
                                user
                            ],
                            messages: []
                        }
                    }
                    userIDToSocketIDCache[member].forEach(socket => {
                        io.sockets.sockets.get(socket).join(group)
                        io.sockets.sockets.get(socket).emit('added-to-group', { site, group: groupData })
                    })
                }
            }
        })

        socket.on("send-request", async (site, callback) => {
            const request = await db.sendRequest(site, userData._id)
            let user = {
                username: userData.username,
                _id: userData._id
            }
            if (request.success) {
                if (userIDToSocketIDCache[request.site.creator]) {
                    userIDToSocketIDCache[request.site.creator].forEach(socket => {
                        io.to(socket).emit('request-message', { site: request.site._id, user })
                    })
                }
                sysLog(`${userData.username} request to join ${site}`)
                callback(true, { _id: request.site._id, name: request.site.name })
                restSocketsUpdate(userData._id, socket.id, 'send-request', { _id: request.site._id, name: request.site.name })
            } else {
                sysLog(`Join request from ${userData.username} to ${site} failed: ${request}`)
            }

        })

        socket.on('accept-invitation', async (site, callback) => {
            const invitation = await db.acceptInvitation(site, userData._id)
            if (invitation.success) {
                let user = {
                    _id: userData._id,
                    username: userData.username
                }
                let group = invitation.generalGroup._id.toString()
                groupToSiteCache[group] = site
                socket.join(group)
                socket.to(group).emit("join-message", {
                    user,
                    online: true,
                    site,
                    group
                })
                let siteData = {
                    [site]: {
                        name: invitation.site.name,
                        creator: invitation.site.creator,
                        groups: {
                            [group]: {
                                name: 'General',
                                members: [
                                    ...invitation.generalGroup.members,
                                    user
                                ],
                                messages: []
                            }
                        }
                    }
                }
                let memberIDs = invitation.generalGroup.members.map(m => m._id)
                let onlineMembers = getOnlineMembers(memberIDs)

                sysLog(`${userData.username} accepted invitation and joined ${invitation.site.name}`)
                callback(true, { siteData, onlineMembers })
                restSocketsJoin(userData._id, socket.id, group)
                restSocketsUpdate(userData._id, socket.id, "accept-invitation", { siteData, onlineMembers })
            }
            else {
                sysLog(`Join attempt from ${userData.username} to ${site} failed: ${invitation}`)
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

        socket.on('cancel-request', async (request, callback) => {
            await db.cancelRequest(request._id, userData._id)
            sysLog(`Join request from ${userData.username} to ${request.name} canceled by user.`)
            // emit msg to admin to update project pending members list?
            callback()
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

        socket.on('reject-request', async ({ site, request }, callback) => {
            await db.rejectRequest(site, request._id)
            sysLog(`Join request from ${request.username} to join ${site} rejected by admin.`)
            // emit msg to user to update his pending projects list?
            callback()
        })


        socket.on('accept-request', async ({ user, site }, callback) => {
            const requestData = await db.acceptRequest(site, user._id, userData._id)
            if (requestData.success) {
                let online = userIDToSocketIDCache[user._id] ? true : false
                let group = requestData.generalGroup._id.toString()
                groupToSiteCache[group] = site
                io.to(group).emit("join-message", {
                    user,
                    online,
                    site,
                    group
                })
                // if user is online send him data
                if (online) {
                    let siteData = {
                        [site]: {
                            name: requestData.site.name,
                            creator: requestData.site.creator,
                            groups: {
                                [group]: {
                                    name: requestData.generalGroup.name,
                                    members: [
                                        ...requestData.generalGroup.members,
                                        user
                                    ],
                                    messages: []
                                }
                            }
                        }
                    }
                    let memberIDs = requestData.generalGroup.members.map(m => m._id)
                    let onlineMembers = getOnlineMembers(memberIDs)

                    userIDToSocketIDCache[user._id].forEach(socket => {
                        io.sockets.sockets.get(socket).join(group)
                        io.sockets.sockets.get(socket).emit('request-accepted', { site: siteData, onlineMembers })
                    })

                }
                callback()
                sysLog(`Join request from ${user.username} to join ${site} accepted by admin.`)
            }
        })


    })

    // function getGroupMembers(group, members) {
    //     members = members.map(member => member.username)
    //     const onlineSIDs = io.sockets.adapter.rooms.get(group) || new Set()
    //     const online = [...onlineSIDs].map(sid => io.sockets.sockets.get(sid).username)
    //     const offline = members.filter(member => !online.includes(member))
    //     return { online, offline }
    // }

    function getOnlineMembers(allMembers) {
        return allMembers.filter(m => userIDToSocketIDCache[m])
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

function getTime() {
    return new Date().toLocaleTimeString()
}

function sysLog(message) {
    console.log(`[${getTime()}] ${message}`)
}
