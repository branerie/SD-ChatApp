
const inputValidation = (username, password) => {
    if(!username && !password){
        console.error('Login attempt without username and password');
        return false
    } else if (!username) {
        console.error('Login attempt without username');
        return false
    } else if (!password) {
        console.error('Login attempt without password');
        return false
    } else return true
}

module.exports = inputValidation