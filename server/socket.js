const jwt = require('./utils/jwt')
const db = require('./db/query')
const cookie = require("cookie")

module.exports = io => {
    // names cache keeps track of connected users and their assigned socket id
    // It's an object with username as property key and socket id as property value 
    // it is updated on every connect and disconnect 
    const nameToSocketIdCache = {}
    let clientsCount = 0

    io.on("connect", async (socket) => {
        const cookies = cookie.parse(socket.request.headers.cookie || '')
        let token = cookies['x-auth-token'] || ''
        let data = await jwt.verifyToken(token)

        if (!data) { // overkill
            console.log(`[${getTime()}] Connect @ ${socket.id}. Connection refused (JSON Web Token Error)`)
            socket.disconnect()
            return
        }

        let userData = await db.getUserData(data.userID)

        if (!userData) {  // overkill
            console.log(`[${getTime()}] Connect @ ${socket.id}. Connection refused (Unknown username: ${data.username})`)
            socket.disconnect()
            return
        }

        nameToSocketIdCache[userData.username] = socket.id
        clientsCount++
        console.log(`[${getTime()}] Connect @ ${socket.id} (${userData.username}). Total connections in pool: ${clientsCount}.`)

        socket.username = userData.username // save username for a later use
        const groupsData = {}
        const chatsData = {}

        userData.groups.forEach(({ name, members }) => {
            socket.join(name)
            socket.to(name).emit("join-message", { user: userData.username, group: name })
            const { online, offline } = getGroupMembers(name, members)
            groupsData[name] = {
                online,
                offline,
                messages: []
            }
        })

        let messagePool = await db.getMessages(userData)

        messagePool.forEach(msg => {
            switch (msg.onModel) {
                case "User":
                    // determine who is the other party in conversation
                    let party = msg.source.username === data.username ? msg.destination.username : msg.source.username
                    if (!chatsData[party]) chatsData[party] = { messages: [] }
                    chatsData[party].messages.push({
                        user: msg.source.username,
                        msg: msg.content,
                        timestamp: msg.createdAt
                    })
                    break;

                case "Group":
                    groupsData[msg.destination.name].messages.push({
                        user: msg.source.username,
                        msg: msg.content,
                        timestamp: msg.createdAt
                    })
                    break;

                default:
                    break;
            }
        })

        // Welcome message from server to connected client
        // Send groups and chats to client for UI setup
        socket.emit("welcome-message", {
            groups: groupsData,
            chats: chatsData
        })

        // EVENT LISTENERS SECTION
        // Notify users on disconnect
        socket.on("disconnecting", (reason) => {
            delete nameToSocketIdCache[userData.username]
            clientsCount--
            console.log(`[${getTime()}] Disconnect @ ${socket.id} (${userData.username}). Reason: ${reason}. Total connections in pool: ${clientsCount}.`)
            // send message to user groups that he quit
            socket.rooms.forEach(group => {
                socket.to(group).emit("quit-message", { user: userData.username, reason, group })
            })
        })

        // Get message from client and send to rest clients
        socket.on("group-chat-message", async ({ msg, recipient }, callback) => {
            let newMessage = await db.createPublicMessage(userData._id, recipient, msg)
            if (!newMessage) return // validate query
            console.log(`[${getTime()}] Message (group): ${userData.username} >> ${recipient}`)
            socket.to(recipient).emit("group-chat-message", { user: userData.username, msg, group: recipient })
            callback()
        })

        socket.on("single-chat-message", async ({ msg, recipient }, callback) => {
            let newMessage = await db.createPrivateMessage(userData._id, recipient, msg)
            if (!newMessage) return // validate query

            if (nameToSocketIdCache[recipient]) {
                console.log(`[${getTime()}] Message (private): ${userData.username} >> ${recipient}`)
                io.to(nameToSocketIdCache[recipient]).emit("single-chat-message", { user: userData.username, msg })
            } else {
                // send offline msg to DB if not in blacklist
                console.log(`[${getTime()}] Message (offline): ${userData.username} >> ${recipient}`)
            }
            callback()
        })

        socket.on("close-chat", async (recipient) => {
            await db.removeChat(userData._id, recipient)
        })

        socket.on("join-request", async ({ group }, callback) => {
            let requestedGroup = await db.joinGroup(userData._id, group)
            if (requestedGroup.error) {
                console.log(`[${getTime()}] Join request: ${userData.username} >> ${group}. Refused: ${requestedGroup.error}`)
                callback(false, requestedGroup.error)
            } else {
                console.log(`[${getTime()}] Join request: ${userData.username} >> ${group}. Success.`)
                socket.join(group)
                socket.to(group).emit("join-message", { user: userData.username, group })
                const {online, offline} = getGroupMembers(group, requestedGroup.members)
                const groupData = {
                    online,
                    offline,
                    messages: [] // get history messages ?
                }
                callback(true, groupData)
            }
        })

        socket.on('create-group', async ({ group }, callback) => {
            const request = await db.createGroup(group, userData._id)
            if (request.success) {
                socket.join(group)
                const groupData = {
                    online: [userData.username],
                    offline: [],
                    messages: []
                }
                callback(true, groupData)
            } else {
                callback(false, request.message)
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
}

function getTime() {
    return new Date().toLocaleTimeString()
}
