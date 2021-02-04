require('dotenv').config()

const config = require("./config/config")
const express = require("express")
const app = express()

require('./config/express')(app)
require('./config/routes')(app)

if (config.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile('../../client/build.index.html')
    })
}

const connectDB = require ('./config/database')
connectDB()

const server = app.listen(config.PORT, console.log(`Listening on port ${config.PORT}!`))

const socketio = require("socket.io")
const io = socketio(server)

require("./socket")(io)
