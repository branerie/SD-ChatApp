const { User, Site, Group, Message } = require('../models')

const getUserData = async (id) => {
    let data = await User.findById(id, 'username groups chats invitations requests').populate({
        path: 'chats',
        select: 'username'
    }).populate({
        path: 'invitations',
        select: 'name',
    }).populate({
        path: 'requests',
        select: 'name',
    }).populate({
        path: 'groups',
        select: 'name members site',
        // populate: {
        //     path: 'members site',
        //     select: 'username name creator',
        // },
        populate: [{
            path: 'members',
            select: 'username',
        },
        {
            path: 'site',
            select: 'name creator invitations requests',
            populate: {
                path: 'invitations requests',
                select: 'username'
            }
        }],
    }).lean()
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
    }, '-_id -__v -updatedAt').populate({ path: 'source', select: 'username' }).populate({ path: 'destination' }).lean()
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
        // console.log(newMessage)
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
    await User.findByIdAndUpdate(sender, { $addToSet: { chats: [recipient] } })
    await User.findByIdAndUpdate(recipient, { $addToSet: { chats: [sender] } })
    let message = new Message({
        source: sender,
        destination: recipient,
        onModel: 'User',
        content: msg
    })
    try {
        let newMessage = await message.save()
        // console.log(newMessage)
        return newMessage
    } catch (error) {
        return false
    }
}

// const joinGroup = async (uid, group) => {
//     try {
//         const newGroup = await Group.findOne({ name: group }).populate({ path: 'members', select: 'username' })
//         if (newGroup === null) throw new Error('Group doesn\'t exist.')

//         const members = newGroup.members.map(member => member._id)
//         if (members.includes(uid)) throw new Error("You are already there.")

//         if (newGroup.open === false) throw new Error("Group is private.") //todo

//         await syncUserAndGroupData(uid, newGroup._id)
//         return newGroup
//     } catch (error) {
//         console.error(error.message)
//         return { error: error.message }
//     }
// }

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
        // console.log(newSite);
        const generalGroup = await createGeneralGroup(creator, siteData._id)
        return { success: true , groupID: generalGroup._id, siteID: siteData._id}
    } catch (error) {
        if (error.code === 11000) {
            return { success: false, message: "Site exists" }
        }
        // add validations in model and check for more errors
        return { success: false, message: error.code }
    }
}

const createGeneralGroup = async (creator, site) => {
    const groupData = new Group({
        name: 'General',
        creator,
        site,
        members: [creator]
    })

    try {
        const newGroup = await groupData.save()
        // console.log(newGroup);
        await User.updateOne({ _id: creator }, { $addToSet: { groups: [newGroup._id] } })
        return { success: true, _id: newGroup._id }
    } catch (error) {
        // add validations in model and check for more errors
        return { success: false, message: error.code }
    }
}

const createGroup = async (site, name, creator) => {
    // check privileges
    // 1. find site creator and compare ids
    const siteCheck = await Site.findOne({_id: site, creator})
    if (siteCheck === null) {
        // syslog required (might be attack)
        return { success: false, message: 'Site not found or restricted' }
    }

    // 2. check that group name is unique (for this site, not in model)
    const groupCheck = await Group.findOne({name, site})
    if (groupCheck !== null) {
        return { success: false, message: 'Group exists' }
    }

    const groupData = new Group({
        name,
        creator,
        site,
        members: [creator]
    })

    try {
        const newGroup = await groupData.save()
        // console.log(newGroup);
        await User.updateOne({ _id: creator }, { $addToSet: { groups: [newGroup._id] } })
        return { success: true, _id: newGroup._id }
    } catch (error) {
        // add validations in model and check for more errors
        return { success: false, message: error.code }
    }
}

const inviteUser = async (username, siteID, siteCreator) => {
    try {
        // check userId from socket and compare to site creator
        const site = await Site.findById(siteID, 'name creator invitations')
        if (site === null) throw new Error(`Site with id ${siteID} not found. Illegal operation.`)
        if (site.creator.toString() !== siteCreator.toString()) {
            throw new Error("Site creator doesn't match. Illegal operation.")
        }
        const user = await User.findOne({username})
        if (user === null) throw new Error(`User ${username} not found.`)
        if (site.invitations.includes(user._id.toString())) {
            throw new Error(`Invitation for user ${user._id} (${username}) is already pending.`)
        }
        const generalGroup = await Group.findOne({site: siteID, name: "General"},'members')
        if (generalGroup.members.includes(user._id.toString())) throw new Error(`User ${username} is already a member.`)

        if (user.invitations && user.invitations.includes(siteID)) console.log("User should join general group immediately") //todo
        else {
            await Site.findByIdAndUpdate(siteID, {$addToSet: {invitations: [user._id]}})
            await User.findByIdAndUpdate(user._id, {$addToSet: {invitations: [site._id]}})
            return { success: true, userID: user._id, siteData: {_id: site._id, name: site.name} }
        }
    } catch (error) {
        return error.message
    }
}

const requestJoin = async (siteName, userID) => {
    try {
        const site = await Site.findOne({name: siteName})
        if (site === null) throw new Error(`${siteName} doesn't exist.`)
        const generalGroup = await Group.findOne({site: site._id, name: "General"},'members')
        // console.log(generalGroup);
        if (generalGroup.members.includes(userID)) throw new Error(`You are already a member.`)
        if (site.requests && site.requests.includes(userID)) throw new Error(`Request already exist.`)

        if (site.invitations && site.invitations.includes(userID)) console.log("User should join general group immediately") // todo
        else {
            await Site.findByIdAndUpdate(site._id, {$addToSet: {requests: [userID]}})
            await User.findByIdAndUpdate(userID, {$addToSet: {requests: [site._id]}})
            return { success: true, site }
        }
    } catch (error) {
        return error.message
    }
}

module.exports = {
    getUserData,
    getMessages,
    removeChat,
    createPublicMessage,
    createPrivateMessage,
    // joinGroup,
    createSite,
    createGroup,
    inviteUser,
    requestJoin
}