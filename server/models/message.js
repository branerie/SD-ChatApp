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
    type: {
        type: String,
        required: true,
        default: 'plain',
        enum: ['plain', 'uri', 'image']
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Message', MessageSchema)