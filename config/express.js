const express = require('express')
const staticFiles = express.static('../static')

module.exports = (app) => {
    app.use(staticFiles)
    app.use(express.json())
    // app.use(express.urlencoded({ extended: false }))
}