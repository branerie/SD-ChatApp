const jwt = require('jsonwebtoken')
const config = require("../config/config")

const createToken = (userObject) => {
    const token = jwt.sign({
        userID: userObject._id,
        username: userObject.username
    }, config.SECRET_KEY)
    return token
}

const verifyToken = async (token) => {
    let data = jwt.verify(token, config.SECRET_KEY, (error, data) => {
        if (error) {
            console.error(`Error: ${error.message}. JWT missing or modified.`)
            return null
        }
        return data
    })
    return data
}

module.exports = {
    createToken,
    verifyToken
}