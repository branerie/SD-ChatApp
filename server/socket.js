const { User, Group } = require('./models')
const jwt = require('./utils/jwt')

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

        let queryName = data.username
        let userData = await User.findOne({
            username: queryName
        }, 'groups chats').populate({
            path: 'chats',
            select: "username -_id"
        })

        // this check will be done at rest api to avoid unnecessary connections but may be left in case of leaks
        if (!userData) {
            console.log(`[${getTime()}] Connect @ ${socket.id}. Connection refused (Unknown username: ${queryName})`)
            socket.disconnect()
            return
        }

        nameToSocketIdCache[queryName] = socket.id
        clientsCount++
        console.log(`[${getTime()}] Connect @ ${socket.id} (${queryName}). Total connections in pool: ${clientsCount}.`)

        socket.userData = {} // initialize empty object for user data from DB
        socket.userData.name = queryName
        socket.userData.groups = {}
        socket.userData.chats = userData.chats.map(chat => chat.username)

        let groupData = await Group.find({
            _id: { $in: userData.groups }
        }, 'name members -_id').populate({ path: 'members', select: 'username -_id' })

        let groups = groupData.map(group => group.name)
        socket.join(groups)

        groupData.forEach(({ name, members }) => {
            members = members.map(member => member.username)
            let online = io.sockets.adapter.rooms.get(name) || new Set()
            // console.log(online);
            online = [...online].map(sid => io.sockets.sockets.get(sid).userData.name) // React likes Array
            socket.userData.groups[name] = {
                online,
                offline: members ? members.filter(member => !online.includes(member)) : []
            }
        })

        // console.log("groups", socket.userData.groups);
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
        socket.on("group-chat-message", ({ msg, recipient }, callback) => {
            console.log(`[${getTime()}] Message (group): ${socket.userData.name} >> ${recipient}`)
            socket.to(recipient).emit("group-chat-message", { user: socket.userData.name, msg, group: recipient })
            callback()
        })

        socket.on("single-chat-message", async ({ msg, recipient }, callback) => {
            let chat = await User.findOne({ username: recipient }, '_id')
            await User.updateOne({ username: queryName }, { $addToSet: { chats: [chat._id] } })
            await User.updateOne({ username: recipient }, { $addToSet: { chats: [userData._id] } })

            if (!socket.userData.chats.includes(recipient)) {
                socket.userData.chats.push(recipient)
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
            let chat = await User.findOne({ username: recipient }, '_id')
            await User.updateOne({ username: queryName }, { $pullAll: { chats: [chat._id] } })
            socket.userData.chats = socket.userData.chats.filter(name => name !== recipient)
            console.log(socket.userData.chats);
        })

        socket.on("join-request", async ({ group }, callback) => {
            let msg = ''
            let requestedGroup = await Group.findOne({ name: group }).populate({ path: 'members', select: 'username -_id' }) // fetch
            let members = requestedGroup ? requestedGroup.members.map(member => member.username) : []
            console.log(requestedGroup);
            if (!requestedGroup) {
                msg = `${group} doesn't exist`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
            } else if (!requestedGroup.open && !members.includes(socket.userData.name)) {
                msg = `${group} is closed`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
            } else if (Object.keys(socket.userData.groups).includes(requestedGroup.name)) {
                msg = `Already there`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
            } else {
                await User.updateOne({ username: queryName }, { $addToSet: { groups: [requestedGroup._id] } })
                await Group.updateOne({ name: group }, { $addToSet: { members: [userData._id] } })
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Success.`)
                socket.join(group)
                let online = io.sockets.adapter.rooms.get(group) || new Set()
                online = [...online].map(sid => io.sockets.sockets.get(sid).userData.name)
                socket.userData.groups[group] = {
                    online,
                    offline: members ? members.filter(member => !online.includes(member)) : []
                }
                socket.to(group).emit("join-message", { user: socket.userData.name, group })
                callback(true, socket.userData.groups)
            }
        })

        socket.on('create-group', async ({ group }, callback) => {
            let checkGroup = await Group.findOne({ name: group })
            if (checkGroup) {
                callback(false, "Group exists")
            } else {
                const newGroup = new Group({
                    name: group,
                    creator: userData._id,
                    members: [userData._id]
                })
                const groupObject = await newGroup.save()
                socket.join(group)
                socket.userData.groups[group] = {
                    online: [queryName],
                    offline: []
                }
                callback(true, socket.userData.groups)
            }
        })
    })
}


function getTime() {
    return new Date().toLocaleTimeString()
}
