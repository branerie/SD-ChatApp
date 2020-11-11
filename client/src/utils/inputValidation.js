const inputDataValidation = (username, password, rePassword) => {
    if (!username) {
        return 'Please fill your username'
    }
    if (!password) {
        return 'Please fill your password'
    }
    if (password !== rePassword) {
        return 'Please check your password'
    }
    return null
}

export default inputDataValidation