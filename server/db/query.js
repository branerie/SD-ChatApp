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
        populate: [{
            path: 'members',
            select: 'username',
        }, {
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

// add group id to user groups and user id to group members
const syncUserAndProjectData = async (uid, gid, sid) => {
    try {
        await User.findByIdAndUpdate(uid, { $addToSet: { groups: [gid] }, $pull: { invitations: sid, requests: sid } })
        await Group.findByIdAndUpdate(gid, { $addToSet: { members: [uid] } })
        await Site.findByIdAndUpdate(sid, { $pull: { invitations: uid, requests: uid } })
    } catch (error) {
        console.error(error)
        throw new Error('Something went wrong. Contact service provider.')
    }
}

const createSite = async (name, creator) => {
    const siteData = new Site({
        name,
        creator
    })

    try {
        const newSite = await siteData.save()
        // console.log(newSite);
        const generalGroup = await createGeneralGroup(creator, siteData._id)
        return { success: true, groupID: generalGroup._id, siteID: siteData._id }
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
    const siteCheck = await Site.findOne({ _id: site, creator })
    if (siteCheck === null) {
        // syslog required (might be attack)
        return { success: false, message: 'Site not found or restricted' }
    }

    // 2. check that group name is unique (for this site, not in model)
    const groupCheck = await Group.findOne({ name, site })
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
        const user = await User.findOne({ username })
        if (user === null) throw new Error(`User ${username} not found.`)
        if (site.invitations.includes(user._id.toString())) {
            throw new Error(`Invitation for user ${user._id} (${username}) is already pending.`)
        }
        const generalGroup = await Group.findOne({ site: siteID, name: "General" }, 'members')
        if (generalGroup.members.includes(user._id.toString())) throw new Error(`User ${username} is already a member.`)

        if (user.requests && user.requests.includes(siteID)) console.log("User should join general group immediately") //todo

        await Site.findByIdAndUpdate(siteID, { $addToSet: { invitations: [user._id] } })
        await User.findByIdAndUpdate(user._id, { $addToSet: { invitations: [site._id] } })
        return { success: true, userData: {_id: user._id, username }, siteData: { _id: site._id, name: site.name } }

    } catch (error) {
        return error.message
    }
}

const addUserToGroup = async (userID, siteID, groupID, adminID) => {
    try {
        // check if site is valid and site admin match
        const siteData = await Site.findOne({ _id: siteID, creator: adminID })
        if (siteData === null) throw new Error(`Site not found or admin mismatch. Site: ${siteID}. Admin: ${adminID}`)
        // check if user is valid and exists
        const userData = await User.findById(userID)
        if (userData === null) throw new Error(`User ${userID} not found`)
        // check if user is a member of project (project general group)
        const generalGroup = await Group.findOne({ site: siteID, name: 'General' }, 'members')
        if (!generalGroup.members.includes(userID)) throw new Error(`User ${userID} (${userData.username}) is not a member of project ${siteID} (${siteData.name})`)
        // check if group exists and if user is not already a member of this group
        const groupData = await Group.findOne({ _id: groupID, site: siteID }).populate({path: 'members', select: 'username'})
        if (groupData === null) throw new Error(`Group ${groupID} in project ${siteID} not found`)
        if (groupData.members.map(m => m._id).includes(userID)) throw new Error(`User ${userID} (${userData.username}) is already part of group ${groupID} (${groupData.name})`)

        await User.findByIdAndUpdate(userID, { $addToSet: { groups: [groupID] } })
        await Group.findByIdAndUpdate(groupID, { $addToSet: { members: [userID] } })
        return { success: true, siteData, generalGroup, userData, groupData }
    } catch (error) {
        if (error.name === "CastError") return `CastError: ${error.message}`
        return error.message
    }
}

const sendRequest = async (siteName, userID) => {
    try {
        const site = await Site.findOne({ name: siteName })
        if (site === null) throw new Error(`${siteName} doesn't exist.`)
        const generalGroup = await Group.findOne({ site: site._id, name: "General" }, 'members')
        if (generalGroup.members.includes(userID)) throw new Error(`You are already a member.`)
        if (site.requests && site.requests.includes(userID)) throw new Error(`Request already exist.`)

        if (site.invitations && site.invitations.includes(userID)) console.log("User should join general group immediately") // todo

        await Site.findByIdAndUpdate(site._id, { $addToSet: { requests: [userID] } })
        await User.findByIdAndUpdate(userID, { $addToSet: { requests: [site._id] } })
        return { success: true, site }

    } catch (error) {
        return error.message
    }
}

const acceptInvitation = async (siteID, userID) => {
    try {
        const site = await Site.findById(siteID)
        if (site === null) throw new Error(`${siteID} doesn't exist.`)
        if (!site.invitations.includes(userID)) throw new Error(`User ${userID} doesn't have invitation for project ${siteID}`)
        const generalGroup = await Group.findOne({ site: siteID, name: "General" }).populate({ path: 'members', select: 'username' })
        if (generalGroup.members.map(m => m._id).includes(userID)) throw new Error(`You are already a member.`)
        await syncUserAndProjectData(userID, generalGroup._id, siteID)
        return { success: true, site, generalGroup } //? return data (group id,name and members)
    } catch (error) {
        return error.message
    }
}

const acceptRequest = async (siteID, userID) => {
    try {
        const site = await Site.findById(siteID)
        if (site === null) throw new Error(`${siteID} doesn't exist.`)
        if (!site.requests.includes(userID)) throw new Error(`User ${userID} didn't requested to join project ${siteID}`)
        const generalGroup = await Group.findOne({ site: siteID, name: "General" }).populate({ path: 'members', select: 'username' })
        if (generalGroup.members.includes(userID)) throw new Error(`User is already a member.`)
        await syncUserAndProjectData(userID, generalGroup._id, siteID)
        return { success: true, site, generalGroup } //? return data (group id,name and members)
    } catch (error) {
        return error.message
    }
}

const rejectRequest = async (sid, uid) => {
    await Site.findByIdAndUpdate(sid, { $pull: { requests: uid } })
    await User.findByIdAndUpdate(uid, { $pull: { requests: sid } })
}

const cancelRequest = async (sid, uid) => {
    await Site.findByIdAndUpdate(sid, { $pull: { requests: uid } })
    await User.findByIdAndUpdate(uid, { $pull: { requests: sid } })
}

const rejectInvitation = async (sid, uid) => {
    await Site.findByIdAndUpdate(sid, { $pull: { invitations: uid } })
    await User.findByIdAndUpdate(uid, { $pull: { invitations: sid } })
}

const cancelInvitation = async (sid, uid) => {
    await Site.findByIdAndUpdate(sid, { $pull: { invitations: uid } })
    await User.findByIdAndUpdate(uid, { $pull: { invitations: sid } })
}


module.exports = {
    getUserData,
    getMessages,
    removeChat,
    createPublicMessage,
    createPrivateMessage,
    createSite,
    createGroup,
    inviteUser,
    addUserToGroup,
    sendRequest,
    acceptInvitation,
    cancelRequest,
    rejectInvitation,
    cancelInvitation,
    acceptRequest,
    rejectRequest
}