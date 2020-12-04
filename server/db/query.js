const { User, Group, Message } = require('../models')

const getUserData = async (id) => {
    let data = await User.findById(id, 'groups chats').populate({
        path: 'chats',
        select: 'username'
    })
    return data
}

const getUserGroupsData = async (groups) => {
    const data = await Group.find({
        _id: { $in: groups }
    }, 'name members -_id').populate({ path: 'members', select: 'username -_id' })
    return data
}

const getMessages = async (userData) => {
    const chats = userData.chats.map(chat => chat._id)
    const messages = await Message.find({
        $or: [
            { destination: { $in: userData.groups } },
            { destination: { $in: chats }, source: userData._id },
            { source: { $in: chats }, destination: userData._id },
        ]
    },'-_id -__v -updatedAt').populate({path: 'source', select: 'username'}).populate({path: 'destination'})
    return messages
}

const createPublicMessage = async (sender, recipient, msg) => {
    // check if group is valid and if user has access to it
    let group = await Group.findOne({ name: recipient })
    let message = new Message({
        source: sender,
        destination: group._id,
        onModel: 'Group',
        content: msg
    })
    try {
        let newMessage = await message.save()
        console.log(newMessage)
        return newMessage      
    } catch (error) {
        return false
    }
}

const removeChat = async (id, recipient) => {
    let chat = await User.findOne({ username: recipient }, '_id')
    await User.findByIdAndUpdate(id, { $pullAll: { chats: [chat._id] } })
}

const createPrivateMessage = async (sender, recipient, msg) => {
    let chat = await User.findOne({ username: recipient }, '_id')
    await User.findByIdAndUpdate(sender, { $addToSet: { chats: [chat._id] } })
    await User.updateOne({ username: recipient }, { $addToSet: { chats: [sender] } })
    let message = new Message({
        source: sender,
        destination: chat._id,
        onModel: 'User',
        content: msg
    })
    try {
        let newMessage = await message.save()
        console.log(newMessage)
        return newMessage      
    } catch (error) {
        return false
    }
}

const joinGroup = async (id, group) => {
    try {
        const newGroup = await Group.findOne({ name: group }).populate({ path: 'members', select: 'username -_id' })
        await User.findByIdAndUpdate(id, { $addToSet: { groups: [newGroup._id] } })
        await Group.findByIdAndUpdate(newGroup._id, { $addToSet: { members: [id] } })
        return newGroup
    } catch (error) {
        return false
    }
}

const createGroup = async (name, creator) => {
    const groupData = new Group({
        name,
        creator,
        members: [creator]
    })

    try {
        const newGroup = await groupData.save()
        console.log(newGroup);
        await User.updateOne({ _id: creator }, { $addToSet: { groups: [newGroup._id] } })
        return { success: true }
    } catch (error) {
        if (error.code === 11000) {
            return { success: false, message: "Group exists" }
        }
        // add validations in model and check for more errors
        return { success: false, message: error.code }
    }
}


module.exports = {
    getUserData,
    getMessages,
    getUserGroupsData,
    removeChat,
    createPublicMessage,
    createPrivateMessage,
    joinGroup,
    createGroup,
}