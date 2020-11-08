const mock = require("./mock")

module.exports = io => {
    io.on("connect", socket => {
        console.log(`[${getTime()}] SERVER: New connection detected. Socket ID: ${socket.id}`)

        socket.username = socket.handshake.query.username;
        socket.groups = []
        console.log(`[${getTime()}] SERVER: Associating socket ID ${socket.id} with user ${socket.username}`)

        let user = mock.find(x => x.name === socket.username)
        if (user) {
            socket.groups = user.groups
            socket.join(socket.groups, () => {
                socket.groups.forEach(group => {
                    // send join message to group online members so they could update their userlists
                    socket.to(group).emit("join-message", { user: socket.username, group })
                })
            })
        }

        // Welcome message from server to client connected
        socket.emit("welcome-message", {
            time: getTime(),
            user: "SERVER",
            msg: `Welcome ${socket.username}`,
            groups: socket.groups
        })

        // socket.broadcast.emit("notice-message", "User connected to chat", "Say hello to user")

        socket.on("get-userlist", (group, callback) => {
            let clients = []
            io.in(group).clients((error, ids) => {
                clients = ids.map(id => io.of("/").connected[id].username);
                console.log(clients);
                callback(clients)
            })
        })
        
        // Notify users on disconnect
        socket.on("disconnect", () => {
            console.log(`[${getTime()}] SERVER: User ${socket.username} has quit server`)
            // send message to user groups that he quit
            socket.groups.forEach(group => {
                socket.to(group).emit("quit-message", {user: socket.username , group})
            })
        })

        // Get message from client and send to rest clients
        socket.on("chat-message", data => {
            console.log(socket.username, data.group , data.msg)

            //time when server recieved the message
            socket.to(data.group).emit("chat-message", {user: socket.username , group: data.group, msg: data.msg })
            // socket.broadcast.emit("chat-message", {
            //     time: new Date().toLocaleTimeString(),
            //     user: socket.username,
            //     msg
            // })
        })
    })

    function getTime() {
        return new Date().toLocaleTimeString()
    }
}