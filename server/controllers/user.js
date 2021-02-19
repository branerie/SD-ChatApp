const { hashPassword, jwt, inputValidation } = require('../utils')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const models = require('../models')
const db = require('../db/query')

router.post('/login', async (request, response, next) => {
    const {
        username,
        password
    } = request.body

    const validationErrors = inputValidation.login(username, password)
    if (validationErrors.length) {
        response.status(401).send({ error: validationErrors })
        return
    }

    const userObject = await db.loginUser(username)
    if (!userObject) {
        console.error('User not found')
        await bcrypt.compare(password, '$2b$10$duMmYs10wdOwnp4/Sw0rDTo3qUa1iz3rESp.n/3tim3A1iTtlEbit')
        response.status(403).send({ error: ['Username or password invalid!'] })
        return
    }

    const passTest = await bcrypt.compare(password, userObject.password)
    if (passTest) {
        const token = jwt.createToken(userObject)
        response.header('Authorization', token)
        response.send({ username: userObject.username, _id: userObject._id })
    } else {
        console.error('Wrong password')
        response.status(403).send({ error: ['Username or password invalid!'] })
        return
    }
})

router.post('/register', async (request, response, next) => {
    const {
        username,
        password,
        rePassword
    } = request.body

    const validationErrors = inputValidation.register(username, password, rePassword)
    if (validationErrors.length) {
        response.status(401).send({ error: validationErrors })
        return
    }

    const encryptedPassword = await hashPassword(password)
    const data = await db.registerUser(username, encryptedPassword)
    if (data.success) {
        const token = jwt.createToken(data.userObject)
        response.header('Authorization', token)
        response.send({ username: data.userObject.username, _id: data.userObject._id })
    } else {
        response.status(401).send({error: data.error})
    }
})

router.post('/verify', async (request, response, next) => {
    const token = request.headers.authorization || ''
    const data = await jwt.verifyToken(token)
    if (!data) {
        response.send({ status: false })
        return
    }
    const user = await db.verifyUser(data.userID)
    if (!user) {
        response.send({ status: false })
        return
    }
    response.send({
        status: true,
        user: data.username,
        userID: data.userID
    })
})

module.exports = router