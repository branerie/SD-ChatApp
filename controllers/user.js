const express = require ('express')
const router = express.Router()

router.post('/login', (request, response, next) => {
    console.log(request);
    response.redirect('chat.html')
})

router.post('/register', (request, response, next) => {
    console.log(request);
    response.redirect('chat.html')
})

module.exports = router