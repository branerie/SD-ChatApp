const config = require("./config")
const express = require("express")
const app = express()
const static = express.static("./static")
app.use(static)

app.use(express.json())
// app.use(express.urlencoded({ extended: false }));

const routes = require("./routes")
app.use("/", routes)

const http = require("http")
const server = http.createServer(app)

const socketio = require("socket.io")
const io = socketio(server)

io.on("connect", socket => {
    console.log("New connection")
    // Welcome message from server to client connected
    socket.emit("welcome-message", {
        time: getTime(),
        user: "SERVER",
        msg: "Welcome User"
    })

    // Notify rest of the users
    socket.broadcast.emit("notice-message", "User connected to chat", "Say hello to user")

    // Notify users on disconnect

    socket.on("disconnect", () => {
        io.emit("goodbye-message", "User left the building")
    })

    // Get message from client and send to rest clients
    socket.on("chat-message", msg => {
        // console.log(socket);
        console.log(msg)

        //time when server recieved the message
        socket.broadcast.emit("chat-message", {
            time: getTime(),
            user: "Random",
            msg
        })
    })
})

function getTime() {
    let time = new Date()
    return time.toLocaleTimeString()
}

server.listen(config.PORT, console.log(`Server up on http://localhost:${config.PORT}`))