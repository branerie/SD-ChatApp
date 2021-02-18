const login = (username, password, errors = []) => {
    if (!username || !password) {
        console.error('Register attempt without username or password')
        errors.push('Username and password required')
    }
    return errors
}

const register = (username, password, rePassword, errors = []) => {
    if (!username || !password) {
        console.error('Register attempt without username or password')
        errors.push('Username and password required')
    }
    if (!username.match(/^[a-zA-Z0-9]*$/)) {
        errors.push('Allowed only alphanumerics in username')
    }
    if (username.length < 4) {
        errors.push('Username must be min 4 symbols long')
    }
    if (username.length > 20) {
        errors.push('Username must be max 20 symbols long')
    }
    if (password !== rePassword) {
        errors.push('Passwords mismatch')
    }
    return errors
}

module.exports = {
    login,
    register
}