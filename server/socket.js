const mock = require("./mock")

module.exports = io => {
    io.on("connect", socket => {
        socket.username = socket.handshake.query.username;
        socket.groups = []

        console.log(`[${getTime()}] SERVER: Detected connection with socket ID: ${socket.id}. Username: ${socket.username}`)

        let user = mock.find(x => x.name === socket.username) // fetch DB
        if (user) {
            // socket.groups = user.groups
            socket.join(user.groups)
            // console.log(socket.rooms.size);
            // send join message to group online members so they could update their userlists
            socket.rooms.forEach(group => {
                io.to(group).emit("join-message", { user: socket.username, group })
            })
        }

        // Welcome message from server to client connected
        socket.emit("welcome-message", {
            user: "SERVER",
            msg: `Welcome ${socket.username}`,
            groups: [...socket.rooms].slice(1)
        })


        // socket.on("get-userlist", (group, callback) => {
        //     let clients = []
        //     io.in(group).clients((error, ids) => {
        //         clients = ids.map(id => io.of("/").connected[id].username);
        //         // console.log(clients);
        //         callback(clients)
        //     })
        // })

        // Notify users on disconnect
        socket.on("disconnect", (reason) => {
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