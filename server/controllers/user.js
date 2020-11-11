const User = require('../models/user')
const { hashPassword, jwt, inputValidation} = require('../utils')
const express = require('express');
const { models } = require('mongoose');
const router = express.Router()
const bcrypt = require ('bcrypt')

router.post('/login', async (request, response, next) => {
    const {
        username,
        password
    } = request.body

    if(!inputValidation(username, password)){
        response.send('Incorrect input data')
        return
    }

    const userObject = await User.findOne({username})

    if(!userObject){
        response.send('Not found')
    }
    const isPasswordCorrect = await bcrypt.compare(password, userObject.password)
    const token = jwt.createToken(userObject)
    response.cookie('x-auth-token', token)
    response.send(userObject)
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
    const token = jwt.createToken(userObject)
    response.header("Authorization", token)
    response.send(userObject)
})

module.exports = router