const mongoose = require ('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    chatRooms: {
        type: 'ObjectId',
        ref: 'ChatRoom'
    }
})

module.exports = mongoose.model('User', UserSchema)
