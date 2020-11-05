const bcrypt = require('bcrypt')

const passwordEncryption = (password) => {

    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            console.log(error);
            throw error;
        }
        bcrypt.hash(password, salt, (error, hashedPassword) => {
            if (error) {
                console.log(error);
                throw error;
            }
            return hashedPassword
        })
    })
}

module.exports = {
    passwordEncryption
}