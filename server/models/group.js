const mongoose = require ('mongoose')

const GroupSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    site: {
        type: 'ObjectId',
        ref: 'Site',
        required: true
    },
    creator: {
        type: 'ObjectId',
        ref: 'User',
        required: true
    },
    members: [{
        type: 'ObjectId',
        ref: 'User'
    }]
}, {
    timestamps: {
        updatedAt: false
    }
})

module.exports = mongoose.model('Group', GroupSchema)