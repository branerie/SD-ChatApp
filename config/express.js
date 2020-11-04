const express = require('express')

module.exports = (app, staticFiles) => {
    app.use(staticFiles)
    app.use(express.json())
    // app.use(express.urlencoded({ extended: false }))
}