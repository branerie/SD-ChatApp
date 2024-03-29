const express = require('express')
const cors = require('cors')
const path = require('path')
const config = require('../config/config')

module.exports = app => {
    app.use(cors({
        exposedHeaders: 'Authorization'
      }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    if (config.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '..', 'client', 'build')))
    }
}
