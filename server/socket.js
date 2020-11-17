const mockUsers = require("./mock-users")
const mockGroups = require("./mock-groups")

module.exports = io => {
    io.on("connect", socket => {
        socket.username = socket.handshake.query.username
        socket.groups = {}
        socket.chats = []

        console.log(`[${getTime()}] SERVER: Detected connection with socket ID: ${socket.id}. Username: ${socket.username}`)

        let user = mockUsers.find(x => x.name === socket.username) // fetch DB
        if (user) {
            user.groups = [...new Set(user.groups)] // temporary (to remove dubs from mock db)
            user.groups.forEach(group => {
                let { members } = mockGroups.find(x => x.name === group) || []
                let onlineSIDs = io.sockets.adapter.rooms.get(group) || []
                let online = [...onlineSIDs].map(sid => io.sockets.sockets.get(sid).username)
                socket.groups[group] = {
                    online,
                    offline: members ? members.filter(member => !online.includes(member)) : []
                }
            })
            console.log(socket.groups);
            socket.chats = [...new Set(user.chats)] // temporary (to remove dubs from mock db)
            socket.emit("welcome-message", {
                user: "SERVER",
                msg: `Welcome ${socket.username}`,
                groups: socket.groups,
                chats: socket.chats
            })
            socket.join(user.groups)
            // send join message to group online members so they could update their userlists
            socket.rooms.forEach(group => {
                socket.to(group).emit("join-message", { user: socket.username, group })
            })
        }

        // let online = io.sockets.adapter.rooms.get('Cardguard')
        // console.log(online);
        // console.log([...online].map(sid => io.sockets.sockets.get(sid).username))


        // Welcome message from server to connected client
        // Send groups and chats to client for UI setup


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
        socket.on("chat-message", ({ group, msg }, callback) => {
            console.log(`[${getTime()}] SERVER: User ${socket.username} sent message to ${group}`)

            socket.to(group).emit("chat-message", { user: socket.username, group, msg })
            callback()
        })
    })

    function getTime() {
        return new Date().toLocaleTimeString()
    }
}