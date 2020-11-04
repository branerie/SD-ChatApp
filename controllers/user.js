const express = require ('express')
const router = express.Router()

router.post('/login', (request, response, next) => {
    console.log(request);
    response.send('test')
})

module.exports = router