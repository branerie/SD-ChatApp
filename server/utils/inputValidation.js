
const inputValidation = (username, password) =>{
    if(!username){
        console.log('Please fill your username');
        return false
    }
    if(!password){
        console.log('Please fill your password');
        return false
    }
    return true
}

module.exports = inputValidation