const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const createToken = (userObject) => {
    const token = jwt.sign({
        userID: userObject._id,
        username: userObject.username
    }, secretKey)
    return token
}

const verifyToken = async (token) => {
    let data = jwt.verify(token, secretKey, (error, data) => {
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