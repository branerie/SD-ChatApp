const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    source: {
        type: 'ObjectId',
        ref: 'User'
    },
    destination: {
        type: 'ObjectId',
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['User', 'Group']
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: {}})

module.exports = mongoose.model('Message', MessageSchema)