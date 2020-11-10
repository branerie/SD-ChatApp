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
        console.error("Username and password are required!")
        response.json('Username and password are required!')
        return
    }

    const userObject = await User.findOne({username})

    if(!userObject){
        console.error('User not found')
        return
    }
    const isPasswordCorrect = await bcrypt.compare(password, userObject.password)

    
    if(!isPasswordCorrect){
        console.error('Wrong password')
        return
    }

    const token = jwt.createToken(userObject)
    response.cookie('x-auth-token', token)
    response.json(token)
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
    response.cookie('x-auth-token', token)
    response.json(token)
})

module.exports = router