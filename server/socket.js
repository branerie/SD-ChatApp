const jwt = require('./utils/jwt')
const db = require('./db/query')
const cookie = require("cookie")

module.exports = io => {
    // cache keeps track of connected users by id and their assigned socket id
    // it is updated on every connect and disconnect 
    const userIDToSocketIDCache = {}
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

        if (!userData) {  // overkill
            sysLog(`Connect @ ${socket.id}. Connection refused (Unknown username: ${data.username})`)
            socket.disconnect()
            return
        }
        if (userIDToSocketIDCache[userData._id]) { // temporary dublicate connection fix
            sysLog(`Connect @ ${socket.id}. Connection refused (Username already connected: ${data.username})`)
            socket.disconnect()
            return
        }

        userIDToSocketIDCache[userData._id] = socket.id
        clientsCount++
        sysLog(`Connect @ ${socket.id} (${userData.username}). Total connections in pool: ${clientsCount}.`)

        socket.username = userData.username // save username for a later use

        let groupToSiteCache = {}
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
            socket.to(_id).emit("join-message", { user: { _id: userData._id.toString(), username: userData.username }, site: site._id, group: _id })
        })
        reactUserData.onlineMembers = getOnlineMembers([...allMembers])
        // console.log(JSON.stringify(reactUserData, null, 4),"\n","reactUserData END")
        socket.emit("welcome-message", { userData: reactUserData })

        // EVENT LISTENERS SECTION
        // Notify users on disconnect
        socket.on("disconnecting", (reason) => {
            delete userIDToSocketIDCache[userData._id]
            clientsCount--
            sysLog(`Disconnect @ ${socket.id} (${userData.username}). Reason: ${reason}. Total connections in pool: ${clientsCount}.`)
            // send message to user groups that he quit
            socket.rooms.forEach(group => {
                // console.log(group, groupToSiteCache[group]);      
                socket.to(group).emit("quit-message", { user: { _id: userData._id.toString(), username: userData.username }, reason, group, site: groupToSiteCache[group] })
            })
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

            if (userIDToSocketIDCache[recipient]) {
                sysLog(`Message (private): ${userData.username} >> ${recipient}`)
                io.to(userIDToSocketIDCache[recipient]).emit("single-chat-message", { user: { _id: userData._id.toString(), username: userData.username }, msg })
            } else {
                // send offline msg to DB if not in blacklist
                sysLog(`Message (offline): ${userData.username} >> ${recipient}`)
            }
            callback()
        })

        socket.on("close-chat", async (recipient) => {
            await db.removeChat(userData._id, recipient)
        })

        // socket.on("join-request", async ({ group }, callback) => {
        //     let requestedGroup = await db.joinGroup(userData._id, group)
        //     if (requestedGroup.error) {
        //         sysLog(`Join request: ${userData.username} >> ${group}. Refused: ${requestedGroup.error}`)
        //         callback(false, requestedGroup.error)
        //     } else {
        //         sysLog(`Join request: ${userData.username} >> ${group}. Success.`)
        //         socket.join(group)
        //         socket.to(group).emit("join-message", { user: userData.username, group })
        //         const { online, offline } = getGroupMembers(group, requestedGroup.members)
        //         const groupData = {
        //             online,
        //             offline,
        //             messages: [] // get history messages ?
        //         }
        //         callback(true, groupData)
        //     }
        // })

        socket.on('create-site', async ({ site }, callback) => {
            const request = await db.createSite(site, userData._id)
            if (request.success) {
                let groupID = request.groupID.toString()
                socket.join(groupID)
                const siteData = {
                    name: site,
                    creator: userData._id,
                    groups: {
                        [groupID]: {
                            name: 'General',
                            members: [{
                                _id: userData._id,
                                username: userData.username,
                            }],
                            messages: []
                        }
                    }
                }
                callback(true, { siteID: request.siteID, siteData, groupID })
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
                socket.join(groupID)
                const groupData = {
                    // _id,
                    name: group,
                    members: [{
                        _id: userData._id,
                        username: userData.username,
                    }],
                    messages: []
                }
                callback(true, { groupID, groupData })
            } else {
                callback(false, request.message)
            }
        })

        socket.on("invite-user", async ({user, site}, callback) => {
            const inviteData = await db.inviteUser(user, site, userData._id)
            if (inviteData.success) {
                if (userIDToSocketIDCache[inviteData.userID]) {
                    io.to(userIDToSocketIDCache[inviteData.userID]).emit('invite-message', inviteData.siteData)
                }
                sysLog(`${userData.username} invited ${user} to join ${site}`)
                callback(true, inviteData.userID.toString())
            } else {
                sysLog(`Invitation from ${userData.username} to ${user} for ${site} failed: ${inviteData}`)
            }

        })

        socket.on("request-join", async ({site}, callback) => {
            const request = await db.requestJoin(site, userData._id)
            if (request.success) {
                if (userIDToSocketIDCache[request.site.creator]) {
                    io.to(userIDToSocketIDCache[request.site.creator]).emit('request-message', { site: request.site._id , username: userData.username, _id: userData._id })
                }
                sysLog(`${userData.username} request to join ${site}`)
                callback(true, {_id: request.site._id, name: request.site.name})
            } else {
                sysLog(`Join request from ${userData.username} to ${site} failed: ${request}`)
            }

        })

    })

    function getGroupMembers(group, members) {
        members = members.map(member => member.username)
        const onlineSIDs = io.sockets.adapter.rooms.get(group) || new Set()
        const online = [...onlineSIDs].map(sid => io.sockets.sockets.get(sid).username)
        const offline = members.filter(member => !online.includes(member))
        return { online, offline }
    }

    function getOnlineMembers(allMembers) {
        return allMembers.filter(m => userIDToSocketIDCache[m])

    }
}

function getTime() {
    return new Date().toLocaleTimeString()
}

function sysLog(message) {
    console.log(`[${getTime()}] ${message}`)
}
