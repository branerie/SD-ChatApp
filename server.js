const dotEnv = require('dotenv')
dotEnv.config()

const routes = require("./config/routes")
const config = require("./config/config")
const expressConfig = require('./config/express')
const connectDB = require ('./config/database')
const express = require("express")
const app = express()
const staticFiles = express.static('./static')


connectDB()
expressConfig(app,staticFiles)
routes(app)



const server = app.listen(config.port, console.log(`Listening on port ${config.port}!`))


const socketio = require("socket.io")
const io = socketio(server)

io.on("connect", socket => {
    console.log("New connection")
    console.log("server",socket.id);
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

    socket.on("login", (data) => {
        socket.user = data
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