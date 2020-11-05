const User = require('../models/user')
const { hashPassword, jwt } = require('../utils')
const express = require('express');
const { models } = require('mongoose');
const router = express.Router()

router.post('/login', (request, response, next) => {
    console.log(request);
    response.redirect('chat.html')
})

router.post('/register', async (request, response, next) => {
    const {
        username,
        password
    } = request.body
    const encryptedPassword = await hashPassword(password)
    const user = new User({
        username, 
        password: encryptedPassword
    })
    const userObject = await user.save()
    const token = jwt.createToken({
        userID: userObject._id,
        username: userObject.username
    })
    response.cookie('x-auth-token', token)
    response.send(userObject)
})

module.exports = router