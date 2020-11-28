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

    groups: [{
        type: 'ObjectId',
        ref: 'Group'
    }],

    chats: [{
        type: 'ObjectId',
        ref: 'User'
    }],

})

module.exports = mongoose.model('User', UserSchema)
