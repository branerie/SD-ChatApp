require('dotenv').config()

const path = require('path')
const config = require('./config/config')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

require('./config/express')(app)
require('./config/routes')(app)

if (config.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client/build/index.html'))
    })
}

const connectDB = require ('./config/database')
connectDB()

server.listen(config.PORT, console.log(`Listening on port ${config.PORT}!`))

require('./socket')(io)
