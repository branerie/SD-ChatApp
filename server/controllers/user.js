const { hashPassword, jwt, inputValidation } = require('../utils')
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const models = require('../models');

router.get('/details/:userId', async (request, response) => {
    const { userId } = request.params

    const user = await models.User.findById(userId)
    if (!user) {
        return response.status(400).send({ error: `User with id ${userId} does not exist.` })
    }

    return response.send({
        userId: userId,
        username: user.username,
        name: user.name,
        ...(user.email) && { email: user.email },
        ...(user.position) && { position: user.position },
        ...(user.company) && { company: user.company },
    })
})

router.post('/login', async (request, response, next) => {
    const {
        username,
        password
    } = request.body

    if (!inputValidation.login(username, password)) {
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
        password,
        rePassword
    } = request.body

    if (!inputValidation.register(username, password, rePassword)) {
        response.status(401).send({ error: 'Username and matching passwords are required!' })
        return
    }

    const encryptedPassword = await hashPassword(password)
    const user = new models.User({
        username,
        password: encryptedPassword
    })
    const userObject = await user.save()
    const token = jwt.createToken(userObject)

    response.header('Authorization', token)
    response.send({ username: userObject.username, _id: userObject._id })
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