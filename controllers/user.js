const express = require ('express')
const router = express.Router()

router.post('/login', (request, response, next) => {
    console.log(request);
    // response.send('test')
    response.redirect('chat.html')
})

module.exports = router