const mongoose = require ('mongoose')

const SiteSchema = new mongoose.Schema ({
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
        default: true
    },
    members: [{
        type: 'ObjectId',
        ref: 'User'
    }],    
    invitations: [{
        type: 'ObjectId',
        ref: 'User'
    }],
    requests: [{
        type: 'ObjectId',
        ref: 'User'
    }]
})

module.exports = mongoose.model('Site', SiteSchema)