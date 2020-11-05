const mock = require("./mock")

module.exports = io => {
    io.on("connect", socket => {
        console.log(`SERVER: New connection detected. Socket ID: ${socket.id}`)

        // Welcome message from server to client connected
        socket.on("login", username => {
            socket.username = username
            let user = mock.find(x => x.name === username);
            // console.log(check ? `Groups list: ${check.groups.toString()}` : "User has no groups")
            console.log(socket.rooms) // will return socket id as a room for private chat
            if (user) {
                socket.join(user.groups, () => {
                    console.log(socket.rooms) // will return socket id and all of rooms
                    user.groups.forEach(group => {
                        // send join message to group online members  
                        socket.to(group).emit("join-message", username)
                    })
                })
            }
            socket.emit("welcome-message", {
                time: getTime(),
                user: "SERVER",
                msg: `Welcome ${username}`,
                groups: user ? user.groups : null
            })
        })

        // Notify rest of the users
        socket.broadcast.emit("notice-message", "User connected to chat", "Say hello to user")

        // Notify users on disconnect

        socket.on("disconnect", () => {
            console.log(`SERVER: User ${socket.username} has quit server`)
            io.emit("quit-message", socket.username)
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