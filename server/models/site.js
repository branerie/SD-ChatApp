const mongoose = require('mongoose')

const SiteSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
    creator: {
        type: 'ObjectId',
        ref: 'User',
        required: true
    },
    open: {
        type: Boolean,
        default: false
    },
    invitations: [{
        type: 'ObjectId',
        ref: 'User'
    }],
    requests: [{
        type: 'ObjectId',
        ref: 'User'
    }]
}, {
    timestamps: {
        updatedAt: false
    }
})

module.exports = mongoose.model('Site', SiteSchema)