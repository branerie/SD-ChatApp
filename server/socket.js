const mockUsers = require("./mock-users")
const mockGroups = require("./mock-groups")

module.exports = io => {
    io.on("connect", socket => {
        socket.username = socket.handshake.query.username
        socket.groups = {}
        socket.chats = []

        console.log(`[${getTime()}] SERVER: Detected connection with socket ID: ${socket.id}. Username: ${socket.username}`)

        let user = mockUsers.find(x => x.name === socket.username) // fetch DB
        let registeredGroups = [...new Set(mockGroups.map(x => x.name))] // get registered groups form mock
        let registeredUsers = [...new Set(mockUsers.map(x => x.name))] // get registered groups form mock
        if (user) {
            user.groups = new Set(user.groups) // temporary (to remove dubs from mock db)
            user.groups.forEach(group => {
                // avoid joining non-existing groups generated in mock data
                if (!registeredGroups.includes(group)) {
                    user.groups.delete(group)
                    return
                }
                let { members } = mockGroups.find(x => x.name === group) || []
                members = [...new Set(members)]
                let onlineSIDs = io.sockets.adapter.rooms.get(group) || []
                let online = [...onlineSIDs].map(sid => io.sockets.sockets.get(sid).username)
                socket.groups[group] = {
                    online,
                    offline: members ? members.filter(member => !online.includes(member)) : []
                }
            })
            user.groups = [...user.groups]

            user.chats = new Set(user.chats) // temporary (to remove dubs from mock db)
            user.chats.forEach(chat => {
                if (!registeredUsers.includes(chat) || chat === user.name) {
                    user.chats.delete(chat)
                }
            })
            socket.chats = [...user.chats]


            // Welcome message from server to connected client
            // Send groups and chats to client for UI setup
            socket.emit("welcome-message", {
                user: socket.username,
                groups: socket.groups,
                chats: socket.chats
            })
            socket.join(user.groups)
            // send join message to group online members so they could update their userlists
            socket.rooms.forEach(group => {
                socket.to(group).emit("join-message", { user: socket.username, group })
            })

            // console.log(io.sockets.adapter.rooms);
            // console.log(io.sockets.sockets);
            io.sockets.sockets.forEach((object, socketID) => console.log(socketID, object.username))
            // console.log(io.eio.clients);
        }


        // socket.on("get-userlist", (group, callback) => {
        //     let clients = []
        //     io.in(group).clients((error, ids) => {
        //         clients = ids.map(id => io.of("/").connected[id].username);
        //         // console.log(clients);
        //         callback(clients)
        //     })
        // })

        // Notify users on disconnect
        socket.on("disconnecting", (reason) => {
            console.log(`[${getTime()}] SERVER: User ${socket.username} has quit server (${reason})`)
            // send message to user groups that he quit
            socket.rooms.forEach(group => {
                socket.to(group).emit("quit-message", { user: socket.username, reason, group })
            })
        })


        // Get message from client and send to rest clients
        socket.on("chat-message", ({ msg, recipient, public }, callback) => {
            console.log(`[${getTime()}] SERVER: User ${socket.username} sent message to ${recipient}`)
            
            if (public) {
                // SEC: Check if user can manipulate group (and message)
                socket.to(recipient).emit("chat-message", { user: socket.username, msg, group: recipient })
            } else {
                // maybe keep track globally in next object to avoid this loop on every message
                let connectedSockets = {}
                io.sockets.sockets.forEach((object, socketID) => {
                    connectedSockets[object.username] = socketID
                })
                console.log(connectedSockets[recipient]);
                io.to(connectedSockets[recipient]).emit("chat-message", { user: socket.username, msg, group: socket.username })
            }
            callback()
        })
    })

    function getTime() {
        return new Date().toLocaleTimeString()
    }
}