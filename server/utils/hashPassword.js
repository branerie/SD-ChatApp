const bcrypt = require('bcrypt')

const saltRounds = 10

const passwordEncryption = async (password) => {
    try {
        const pass = await bcrypt.hash(password, saltRounds)
        return pass
    } catch (error) {
        console.error(error)
        throw error
    }
}

module.exports = passwordEncryption