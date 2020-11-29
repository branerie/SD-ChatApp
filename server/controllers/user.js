const { hashPassword, jwt, inputValidation} = require('../utils')
const express = require('express');
const router = express.Router()
const bcrypt = require ('bcrypt');
const models = require('../models');

router.post('/login', async (request, response, next) => {
    const {
        username,
        password
    } = request.body

    if(!inputValidation(username, password)){
        response.status(401).send({error: 'Username and password are required!'})
        return
    }

    const userObject = await models.User.findOne({username})
    if(!userObject){
        console.error('User not found')
        response.status(403).send({error: 'Username or password invalid!'})
        return
    }
    const isPasswordCorrect = await bcrypt.compare(password, userObject.password)

    
    if(!isPasswordCorrect){
        console.error('Wrong password')
        response.status(403).send({error: 'Username or password invalid!'})
        return
    }
    const token = jwt.createToken(userObject)
    response.header('Authorization', token)
    response.send(userObject)
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

router.post('/verify', async (req, res, next) =>{
    const token = req.headers.authorization || ''
    const data = await jwt.verifyToken(token)
    const user = await models.User.findById(data.userID)
    console.log("Verify:", user);
    if(!user){
        res.send({
            status: false        
        }) 
    }
    res.send({
        status: true,
        user: data.username,
        userID: data.userID
    })
})

module.exports = router