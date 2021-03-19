class UserError extends Error {
    constructor(...params) {
        super(...params)
        
        if (Error.captureStackTrace) Error.captureStackTrace(this, UserError) // v8
        
        this.name = 'UserError'
        // Custom 
        this.date = new Date()
    }
}

module.exports = UserError