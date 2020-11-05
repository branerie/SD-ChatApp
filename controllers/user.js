const User = require('../models/user')
const utils = require('../utils')
const express = require ('express');
const { models } = require('mongoose');
const router = express.Router()

router.post('/login', (request, response, next) => {
    console.log(request);
<<<<<<< Updated upstream
    // response.send('test')
    response.redirect('chat.html')
=======
    response.redirect('chat.html')
})

router.post('/register', async (request, response, next) => {
    const {
        username,
        password
    } = request.body

    
    const createdUser = await models.User.create({username, password})
    const token = await utils.jwt.createToken({id: createdUser._id})
>>>>>>> Stashed changes
})

module.exports = router