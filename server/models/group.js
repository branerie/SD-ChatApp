const mongoose = require ('mongoose')

const GroupSchema = new mongoose.Schema ({
    name: {
        type: String,
        unique: true,
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
})

module.exports = mongoose.model('Group', GroupSchema)