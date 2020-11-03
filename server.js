const config = require("./config")

const express = require("express")
const app = express()
const static = express.static("./static")
app.use(static)

const http = require("http")
const server = http.createServer(app)

const socketio = require("socket.io")
const io = socketio(server)

io.on("connect", socket => {
    console.log("New connection")
    // Welcome message from server to client connected
    socket.emit("welcome-message", "Hello user!", "How are you today?")

    // Notify rest of the users
    socket.broadcast.emit("notice-message", "User connected to chat", "Say hello to user")

    // Notify users on disconnect
    socket.on("disconnect", () => {
        io.emit("goodbye-message", "User left the building")
    })

    // Get message from client and send to all
    socket.on("chat-message", msg => {
        console.log(msg)
        socket.broadcast.emit("chat-message", msg)
    })
})

server.listen(config.PORT, console.log(`Server up on http://localhost:${config.PORT}`))