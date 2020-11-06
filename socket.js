const mock = require("./mock")

module.exports = io => {
    io.of("/chat.html").on("connect", socket => {
        console.log(`[${getTime()}] SERVER: New connection detected. Socket ID: ${socket.id}`)

        socket.username = socket.handshake.query.username;
        socket.groups = []
        console.log(`[${getTime()}] SERVER: Associating socket ID ${socket.id} with user ${socket.username}`)

        // socket.on("get-groups", (username) => {
            let user = mock.find(x => x.name === socket.username)
            if (user) {
                socket.groups = user.groups
                socket.join(socket.groups, () => {
                    socket.groups.forEach(group => {
                        // send join message to group online members  
                        socket.to(group).emit("join-message", socket.username)
                    })
                })
            }

            socket.emit("welcome-message", {
                time: getTime(),
                user: "SERVER",
                msg: `Welcome ${socket.username}`,
                groups: socket.groups
            })
        // })
        // Welcome message from server to client connected

        // Notify rest of the users
        // socket.broadcast.emit("notice-message", "User connected to chat", "Say hello to user")

        // Notify users on disconnect

        socket.on("disconnect", () => {
            console.log(`[${getTime()}] SERVER: User ${socket.username} has quit server`)
            // send message to user groups that he quit
            socket.groups.forEach(group => {
                socket.to(group).emit("quit-message", socket.username)
            })
        })



        // Get message from client and send to rest clients
        socket.on("chat-message", msg => {
            // console.log(socket);
            console.log(msg)

            //time when server recieved the message
            socket.broadcast.emit("chat-message", {
                time: getTime(),
                user: socket.username,
                msg
            })
        })
    })

    function getTime() {
        let time = new Date()
        return time.toLocaleTimeString()
    }
}