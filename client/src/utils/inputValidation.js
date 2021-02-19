export function registerValidation(username, password, rePassword, errors = []) {
    if (!username || !password) {
        errors.push('Username and password required')
    }
    if (!username.match(/^[a-zA-Z0-9]*$/)) {
        errors.push('Allowed only alphanumerics')
    }
    if (username.length < 4) {
        errors.push('Username must be min 4 symbols long')
    }
    if (username.length > 20) {
        errors.push('Username must be max 20 symbols long')
    }
    if (password.length < 8 && password !== process.env.REACT_APP_DEV_PASSWORD) {
        errors.push('Password must be min 8 symbols long')
    }
    if (password.length > 63) {
        errors.push('Password must be max 63 symbols long')
    }
    if (password !== rePassword) {
        errors.push('Passwords mismatch')
    }
    return errors
}

export function loginValidation (username, password, errors = []) {
    if (!username || !password) {
        errors.push('Username and password required')
    }
    return errors
}
