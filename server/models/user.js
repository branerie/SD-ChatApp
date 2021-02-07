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
    email: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        default: function () {
            return this.username
        }
    },
    company: {
        type: String
    },
    position: {
        type: String
    },
    picture: {
        type: String
    },
    mobile: {
        type: String
    },
    social: {
        type: Map,
        of: String
    },
    groups: [{
        type: 'ObjectId',
        ref: 'Group'
    }],
    invitations: [{
        type: 'ObjectId',
        ref: 'Site'
    }],
    requests: [{
        type: 'ObjectId',
        ref: 'Site'
    }],
    chats: [{
        type: 'ObjectId',
        ref: 'User'
    }]
}, {
    timestamps: {
        updatedAt: false
    }
})

module.exports = mongoose.model('User', UserSchema)
