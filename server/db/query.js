const { User, Site, Group, Message } = require('../models')

const getUserData = async (id) => {
    let data = await User.findById(id, 'username groups chats').populate({
        path: 'chats',
        select: 'username'
    }).populate({
        path: 'groups',
        select: 'name',
        populate: {
            path: 'members site',
            // select: 'username',
            //             path: 'site',
            // select: 'name'
        },
        // populate: {
        //     path: 'site',
        //     select: 'name'
        // }
    })
    return data
}

const getMessages = async (userData) => {
    const groups = userData.groups.map(group => group._id)
    const chats = userData.chats.map(chat => chat._id)
    const messages = await Message.find({
        $or: [
            { destination: { $in: groups } },
            { destination: { $in: chats }, source: userData._id },
            { source: { $in: chats }, destination: userData._id },
        ]
    }, '-_id -__v -updatedAt').populate({ path: 'source', select: 'username' }).populate({ path: 'destination' })
    return messages
}

const createPublicMessage = async (sender, recipient, msg) => {
    // check if group is valid and if user has access to it
    await Group.findById(recipient)
    let message = new Message({
        source: sender,
        destination: recipient,
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
    await User.findByIdAndUpdate(chat._id, { $addToSet: { chats: [sender] } })
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

const joinGroup = async (uid, group) => {
    try {
        const newGroup = await Group.findOne({ name: group }).populate({ path: 'members', select: 'username' })
        if (newGroup === null) throw new Error('Group doesn\'t exist.')

        const members = newGroup.members.map(member => member._id)
        if (members.includes(uid)) throw new Error("You are already there.")

        if (newGroup.open === false) throw new Error("Group is private.") //todo

        await syncUserAndGroupData(uid, newGroup._id)
        return newGroup
    } catch (error) {
        console.error(error.message)
        return { error: error.message }
    }
}

// add group id to user groups and user id to group members
const syncUserAndGroupData = async (uid, gid) => {
    try {
        await User.findByIdAndUpdate(uid, { $addToSet: { groups: [gid] } })
        await Group.findByIdAndUpdate(gid, { $addToSet: { members: [uid] } })
    } catch (error) {
        console.error(error)
        throw new Error('Something went wrong. Contact service provider.')
    }
}

const createSite = async (name, creator) => {
    const siteData = new Site({
        name,
        creator,
        members: [creator]
    })

    try {
        const newSite = await siteData.save()
        console.log(newSite);
        const newGroup = await createGroup('General', creator, siteData._id)
        // await User.updateOne({ _id: creator }, { $addToSet: { groups: [newGroup._id] } })
        return { success: true , _id: newGroup._id}
    } catch (error) {
        if (error.code === 11000) {
            return { success: false, message: "Group exists" }
        }
        // add validations in model and check for more errors
        return { success: false, message: error.code }
    }
}

const createGroup = async (name, creator, site) => {
    const groupData = new Group({
        name,
        creator,
        site,
        members: [creator]
    })

    try {
        const newGroup = await groupData.save()
        console.log(newGroup);
        await User.updateOne({ _id: creator }, { $addToSet: { groups: [newGroup._id] } })
        return { success: true, _id: newGroup._id }
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
    removeChat,
    createPublicMessage,
    createPrivateMessage,
    joinGroup,
    createSite,
    createGroup,
}