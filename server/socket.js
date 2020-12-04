const jwt = require('./utils/jwt')
const db = require('./db/query')

module.exports = io => {
    // names cache keeps track of connected users and their assigned socket id
    // It's an object with username as property key and socket id as property value 
    // it is updated on every connect and disconnect 
    const nameToSocketIdCache = {}
    let clientsCount = 0

    io.on("connect", async (socket) => {
        let token = socket.handshake.auth.token
        let data = await jwt.verifyToken(token)

        if (!data) { // just in case
            console.log(`[${getTime()}] Connect @ ${socket.id}. Connection refused (JSON Web Token Error)`)
            socket.disconnect()
            return
        }

        let userData = await db.getUserData(data.userID)
        console.log(userData);

        // this check will be done at rest api to avoid unnecessary connections but may be left in case of leaks
        if (!userData) {
            console.log(`[${getTime()}] Connect @ ${socket.id}. Connection refused (Unknown username: ${data.username})`)
            socket.disconnect()
            return
        }

        nameToSocketIdCache[data.username] = socket.id
        clientsCount++
        console.log(`[${getTime()}] Connect @ ${socket.id} (${data.username}). Total connections in pool: ${clientsCount}.`)

        socket.userData = {} // initialize empty object for user data from DB
        socket.userData.name = data.username
        socket.userData.groups = {}
        socket.userData.chats = {}

        let groupData = await db.getUserGroupsData(userData.groups)

        let groups = groupData.map(group => group.name)
        socket.join(groups)

        groupData.forEach(({ name, members }) => {
            members = members.map(member => member.username)
            let online = io.sockets.adapter.rooms.get(name) || new Set()
            online = [...online].map(sid => io.sockets.sockets.get(sid).userData.name) // React likes Array
            socket.userData.groups[name] = {
                online,
                offline: members.filter(member => !online.includes(member)),
                messages: []
            }
        })

        let messagePool = await db.getMessages(userData)
        console.log("msgs:", messagePool);

        messagePool.forEach(msg => {
            switch (msg.onModel) {
                case "User":
                    // determine who is the partner in conversation
                    let partner = msg.source.username === data.username ? msg.destination.username : msg.source.username
                    if (!socket.userData.chats[partner]) socket.userData.chats[partner] = { messages: [] }
                    socket.userData.chats[partner].messages.push({
                        user: msg.source.username,
                        msg: msg.content,
                        timestamp: msg.createdAt
                    })
                    break;

                case "Group":
                    socket.userData.groups[msg.destination.name].messages.push({
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
            groups: socket.userData.groups,
            chats: socket.userData.chats
        })

        // send join message to group online members so they could update their userlists
        groups.forEach(group => {
            socket.to(group).emit("join-message", { user: socket.userData.name, group })
        })

        // Notify users on disconnect
        socket.on("disconnecting", (reason) => {
            delete nameToSocketIdCache[socket.userData.name]
            clientsCount--
            console.log(`[${getTime()}] Disconnect @ ${socket.id} (${socket.userData.name}). Reason: ${reason}. Total connections in pool: ${clientsCount}.`)
            // send message to user groups that he quit
            groups.forEach(group => {
                socket.to(group).emit("quit-message", { user: socket.userData.name, reason, group })
            })
        })


        // Get message from client and send to rest clients
        socket.on("group-chat-message", async ({ msg, recipient }, callback) => {
            let newMessage = await db.createPublicMessage(userData._id, recipient, msg)
            if (!newMessage) return // validate query
            console.log(newMessage);
            console.log(`[${getTime()}] Message (group): ${socket.userData.name} >> ${recipient}`)
            socket.to(recipient).emit("group-chat-message", { user: socket.userData.name, msg, group: recipient })
            callback()
        })

        socket.on("single-chat-message", async ({ msg, recipient }, callback) => {
            let newMessage = await db.createPrivateMessage(userData._id, recipient, msg)
            if (!newMessage) return // validate query
            if (!socket.userData.chats[recipient]) {
                socket.userData.chats[recipient] = { messages: []}
            }

            if (nameToSocketIdCache[recipient]) {
                console.log(`[${getTime()}] Message (private): ${socket.userData.name} >> ${recipient}`)
                io.to(nameToSocketIdCache[recipient]).emit("single-chat-message", { user: socket.userData.name, msg })
            } else {
                // send offline msg to DB if not in blacklist
                console.log(`[${getTime()}] Message (offline): ${socket.userData.name} >> ${recipient}`)
            }
            callback()
        })

        socket.on("close-chat", async (recipient) => {
            await db.removeChat(userData._id, recipient)
            delete socket.userData.chats[recipient]
        })

        socket.on("join-request", async ({ group }, callback) => {
            let msg = ''
            if (Object.keys(socket.userData.groups).includes(group)) {
                msg = `Already there`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
                return
            }

            let requestedGroup = await db.joinGroup(userData._id, group)
            console.log(requestedGroup)
            if (!requestedGroup) {
                msg = `${group} doesn't exist`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
            } else {
                let members = requestedGroup.members.map(member => member.username)
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Success.`)
                socket.join(group)
                let online = io.sockets.adapter.rooms.get(group) || new Set()
                online = [...online].map(sid => io.sockets.sockets.get(sid).userData.name)
                socket.userData.groups[group] = {
                    online,
                    offline: members.filter(member => !online.includes(member)),
                    messages: []
                }
                socket.to(group).emit("join-message", { user: socket.userData.name, group })
                callback(true, socket.userData.groups)
            }
        })

        socket.on('create-group', async ({ group }, callback) => {
            let request = await db.createGroup(group, userData._id)
            if (request.success) {
                socket.join(group)
                socket.userData.groups[group] = {
                    online: [data.username],
                    offline: [],
                    messages: []
                }
                callback(true, socket.userData.groups)
            } else {
                callback(false, request.message)
            }
        })
    })
}


function getTime() {
    return new Date().toLocaleTimeString()
}
