const mongoose = require ('mongoose')

const chatRoomSchema = new mongoose.Schema ({
    roomName: {
        type: String,
        unique: true,
        required: true
    },
    creator: {
        type: 'ObjectId',
        ref: 'User'
    }
})

module.exports = mongoose.model('ChatRoom', chatRoomSchema)