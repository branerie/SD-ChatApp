
const login = (username, password) => {
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

const register = (username, password, rePassword) => {
    if(!username && !password){
        console.error('Register attempt without username and password');
        return false
    } else if (!username) {
        console.error('Register attempt without username');
        return false
    } else if (!password) {
        console.error('Register attempt without password');
        return false
    } else if (password !== rePassword) {
        console.error('Register password confirmation mismatch');
        return false
    } else return true
}

module.exports = {
    login,
    register
}