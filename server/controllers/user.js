const { hashPassword, jwt, inputValidation } = require('../utils')
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const models = require('../models');

router.post('/login', async (request, response, next) => {
    const {
        username,
        password
    } = request.body

    if (!inputValidation(username, password)) {
        response.status(401).send({ error: 'Username and password are required!' })
        return
    }

    const userObject = await models.User.findOne({ username })
    if (!userObject) {
        console.error('User not found')
        response.status(403).send({ error: 'Username or password invalid!' })
        return
    }
    const isPasswordCorrect = await bcrypt.compare(password, userObject.password)


    if (!isPasswordCorrect) {
        console.error('Wrong password')
        response.status(403).send({ error: 'Username or password invalid!' })
        return
    }
    const token = jwt.createToken(userObject)
    response.header('Authorization', token)
    // console.log(userObject)
    response.send({ username: userObject.username, _id: userObject._id })
})

router.post('/register', async (request, response, next) => {
    const {
        username,
        password
    } = request.body
    const encryptedPassword = await hashPassword(password)
    const user = new models.User({
        username,
        password: encryptedPassword
    })
    const userObject = await user.save()
    const token = jwt.createToken(userObject)

    response.header('Authorization', token)
    response.send(userObject)
})

router.post('/verify', async (request, response, next) => {
    const token = request.headers.authorization || ''
    const data = await jwt.verifyToken(token)
    if (!data) {
        response.send({ status: false })
        return
    }
    const user = await models.User.findById(data.userID)
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