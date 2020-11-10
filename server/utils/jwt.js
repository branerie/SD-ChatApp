const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const createToken = (userObject) => {
    const token = jwt.sign({
        userID: userObject._id,
        username: userObject.username
    }, secretKey)
    return token
}

module.exports = {
    createToken
}