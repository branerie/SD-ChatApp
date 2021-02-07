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
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                mobile: userData.mobile,
                username: userData.username,
                company: userData.company,
                position: userData.position,
            }
        }
        if (userData.invitations) reactUserData.invitations = userData.invitations
        if (userData.requests) reactUserData.requests = userData.requests
        const allMembers = new Set([userData._id.toString()])

        userIDToSocketIDCache[userData._id] = [...userIDToSocketIDCache[userData._id] || [], socket.id]
        if (userIDToSocketIDCache[userData._id].length === 1) clientsCount++
        socketsCount++
        sysLog(`Connect @ ${socket.id} (${userData.username}). Total clients/connections in pool: ${clientsCount}/${socketsCount}.`)

        socket.username = userData.username // save username for a later use

        userData.groups.forEach(({ _id, name, site, members }) => {
            members.map(member => {
                allMembers.add(member._id.toString())
                if (member.name) { // or in the UI
                    member.username = member.name
                    delete member.name
                }
            })
            // console.log(members);
            groupToSiteCache[_id] = site._id
            if (!reactUserData.sites[site._id]) {
                reactUserData.sites[site._id] = {
                    name: site.name,
                    creator: site.creator,
                    groups: {}
                }
                if (site.creator.toString() === userData._id.toString()) {
                    site.invitations.map(invitation => {
                        allMembers.add(invitation._id.toString())
                        if (invitation.name) { // or in the UI
                            invitation.username = invitation.name
                            delete invitation.name
                        }
                    })
                    reactUserData.sites[site._id].invitations = site.invitations || []

                    site.requests.map(request => {
                        allMembers.add(request._id.toString())
                        if (request.name) { // or in the UI
                            request.username = request.name
                            delete request.name
                        }
                    })
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
            let own = msg.source._id.toString() === userData._id.toString() // boolean
            switch (msg.onModel) {
                case "User":
                    // determine who is the other party in conversation
                    let partyID = own ? msg.destination._id.toString() : msg.source._id.toString()
                    let partyName = own
                        ? msg.destination.name || msg.destination.username
                        : msg.source.name || msg.source.username
                    if (!reactUserData.chats[partyID]) {
                        reactUserData.chats[partyID] = {
                            username: partyName,
                            messages: []
                        }
                    }
                    reactUserData.chats[partyID].messages.push({
                        user: msg.source.name || msg.source.username,
                        msg: msg.content,
                        timestamp: msg.createdAt,
                        own
                    })
                    break;

                case "Group":
                    reactUserData.sites[groupToSiteCache[msg.destination._id]].groups[msg.destination._id].messages.push({
                        user: msg.source.name || msg.source.username,
                        msg: msg.content,
                        timestamp: msg.createdAt,
                        own
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
                        username: userData.name || userData.username
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
                            username: userData.name || userData.username
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
                        user: userData.name || userData.username,
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

        socket.on('create-site', async (site, callback) => { //admin
            const data = await db.createSite(site, userData._id)
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
                                members: [{
                                    _id: userData._id,
                                    username: userData.name || userData.username,
                                }],
                                messages: [{
                                    user: 'SERVER',
                                    timestamp: utcTime(),
                                    msg: `Hello ${userData.name || userData.username}. Welcome to your new project: ${site}. You can invite members in General group or start creating groups now.`,
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
                callback(false, data.message)
            }
        })

        socket.on('create-group', async ({ site, group }, callback) => { //admin
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
            const data = await db.createGroup(site, group, userData._id)
            if (data.success) {
                let groupID = data._id.toString()
                groupToSiteCache[groupID] = site
                socket.join(groupID)
                const groupData = {
                    [groupID]: {
                        name: group,
                        members: [{
                            _id: userData._id,
                            username: userData.name || userData.username,
                        }],
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
                if (userIDToSocketIDCache[data.userData._id]) {
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
                username: userData.username,
                name: userData.name || userData.username,
                _id: userData._id
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
                    username: userData.name || userData.username
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

                data.generalGroup.members.map(member => {
                    if (member.name) { // or in the UI
                        member.username = member.name
                        delete member.name
                    }
                })

                let siteData = {
                    [site]: {
                        name: data.site.name,
                        creator: data.site.creator,
                        groups: {
                            [group]: {
                                name: 'General',
                                members: [
                                    ...data.generalGroup.members,
                                    user
                                ],
                                messages: []
                            }
                        }
                    }
                }
                let memberIDs = data.generalGroup.members.map(m => m._id)
                let onlineMembers = getOnlineMembers(memberIDs)

                sysLog(`${userData.username} accepted invitation and joined ${data.site.name}`)
                callback(true, { siteData, onlineMembers })
                restSocketsJoin(userData._id, socket.id, group)
                restSocketsUpdate(userData._id, socket.id, "invitation-accepted", { siteData, onlineMembers })
            }
            else {
                sysLog(`Join attempt from ${userData.username} to ${site} failed: ${data}`)
            }
        })

        socket.on('accept-request', async ({ user, site }, callback) => { // admin
            const data = await db.acceptRequest(site, user._id, userData._id)
            if (data.success) {
                let online = userIDToSocketIDCache[user._id] ? true : false
                let group = data.generalGroup._id.toString()
                groupToSiteCache[group] = site
                if (user.name) {
                    user.username = user.name
                    delete user.name
                } // temporary

                io.to(group).emit("join-message", {
                    user,
                    online,
                    site,
                    group
                })
                // if user is online send him data
                data.generalGroup.members.map(member => {
                    if (member.name) { // or in the UI
                        member.username = member.name
                        delete member.name
                    }
                })
                if (online) {
                    let siteData = {
                        [site]: {
                            name: data.site.name,
                            creator: data.site.creator,
                            groups: {
                                [group]: {
                                    name: data.generalGroup.name,
                                    members: [
                                        ...data.generalGroup.members,
                                        user
                                    ],
                                    messages: []
                                }
                            }
                        }
                    }
                    let memberIDs = data.generalGroup.members.map(m => m._id)
                    let onlineMembers = getOnlineMembers(memberIDs)

                    userIDToSocketIDCache[user._id].forEach(socket => {
                        io.sockets.sockets.get(socket).join(group)
                        io.sockets.sockets.get(socket).emit('request-accepted', { site: siteData, onlineMembers })
                    })

                }
                // callback()
                sysLog(`Join request from ${user.username} to join ${site} accepted by admin.`)
            }
        })

        socket.on('add-member', async ({ member, site, group }) => {
            if (member === '') return // stop this on client side also
            const data = await db.addUserToGroup(member, site, group, userData._id)
            if (data.success) {
                let online = userIDToSocketIDCache[member] ? true : false
                let user = {
                    _id: data.userData._id,
                    username: data.userData.name || data.userData.username
                }
                io.to(group).emit("join-message", {
                    user,
                    online,
                    site,
                    group
                })

                data.groupData.members.map(member => {
                    if (member.name) { // or in the UI
                        member.username = member.name
                        delete member.name
                    }
                })

                if (online) {
                    let groupData = {
                        [group]: {
                            name: data.groupData.name,
                            members: [
                                ...data.groupData.members,
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

        socket.on('update-profile-data', async (data, callback) => {
            //move this to middleware
            if (!data || data.constructor.name !== 'Object') {
                sysLog(`Invalid data from ${userData._id} Expected Object - got ${data.constructor.name}.`)
                return
            }
            const allowedFields = ['name', 'company', 'position', 'email', 'mobile']
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
            // if name uis changed send newProfileData.name to connected rooms and users via socket? 
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

function utcTime() {
    return new Date().toUTCString()
}

function sysLog(message) {
    console.log(`[${getTime()}] ${message}`)
}
