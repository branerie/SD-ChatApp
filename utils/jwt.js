const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const createToken = (data) => {
    return jwt.sign(data,secretKey)
}

module.exports = {
    createToken
}