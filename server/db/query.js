const { User, Site, Group, Message } = require('../models')

const getUserData = async (id) => {
    let data = await User.findById(id, '-password -__v').populate({
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
            select: 'name username'
        }, {
            path: 'site',
            select: 'name creator invitations requests',
            populate: {
                path: 'invitations requests',
                select: 'name username'
            }
        }],
    }).lean()
    // data.groups.forEach(g => console.log(g.site))
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
    }, '-_id -__v -updatedAt').populate({ path: 'source', select: 'name username' }).populate({ path: 'destination', select: 'name username' }).lean()
    // console.log(messages);
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

const removeChat = async (id, chat) => {
    try {
        await User.findByIdAndUpdate(id, { $pullAll: { chats: [chat] } })
    } catch (error) {
        console.error(error.message);
    }
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

const createSite = async (name, description ,creator) => {
    const siteData = new Site({
        name,
        description,
        creator
    })
    // return
    try {
        const newSite = await siteData.save()
        // console.log(newSite);
        const generalGroup = await createGeneralGroup(creator, siteData._id)
        return { success: true, groupID: generalGroup._id, siteID: siteData._id }
    } catch (error) {
        if (error.code === 11000) {
            return { success: false, errors: ['Project already exists.'] }
        } else if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(e => error.errors[e].message)
            return { success: false, errors }
        } else {
            return { success: false, errors: ['Something went wrong.'] }
        }
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
        return { success: true, userData: { _id: user._id, username, name: user.name }, siteData: { _id: site._id, name: site.name } }

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
        const groupData = await Group.findOne({ _id: groupID, site: siteID }).populate({ path: 'members', select: 'name username' })
        if (groupData === null) throw new Error(`Group ${groupID} in project ${siteID} not found`)
        if (groupData.members.map(m => m._id).includes(userID)) throw new Error(`User ${userID} (${userData.username}) is already part of group ${groupID} (${groupData.name})`)

        await User.findByIdAndUpdate(userID, { $addToSet: { groups: [groupID] } })
        await Group.findByIdAndUpdate(groupID, { $addToSet: { members: [userID] } })
        return { success: true, userData, groupData }
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
        const generalGroup = await Group.findOne({ site: siteID, name: "General" }).populate({ path: 'members', select: 'name username' })
        if (generalGroup.members.map(m => m._id).includes(userID)) throw new Error(`You are already a member.`)
        await syncUserAndProjectData(userID, generalGroup._id, siteID)
        return { success: true, site, generalGroup } //? return data (group id,name and members)
    } catch (error) {
        return error.message
    }
}

const acceptRequest = async (siteID, userID, adminID) => {
    try {
        const site = await Site.findOne({ _id: siteID, creator: adminID })
        if (site === null) throw new Error(`Site not found or admin mismatch. Site: ${siteID}. Admin: ${adminID}`)
        if (!site.requests.includes(userID)) throw new Error(`User ${userID} didn't requested to join project ${siteID}`)
        const generalGroup = await Group.findOne({ site: siteID, name: "General" }).populate({ path: 'members', select: 'name username' })
        if (generalGroup.members.map(m => m._id).includes(userID)) throw new Error(`You are already a member.`)
        await syncUserAndProjectData(userID, generalGroup._id, siteID)
        return { success: true, site, generalGroup } //? return data (group id,name and members)
    } catch (error) {
        return error.message
    }
}

const rejectRequest = async (sid, uid, aid) => {
    try {
        const site = await Site.findOne({ _id: sid, creator: aid })
        if (site === null) throw new Error(`Site not found or admin mismatch. Site: ${sid}. Admin: ${aid}`)
        if (!site.requests.includes(uid)) throw new Error(`User ${uid} didn't requested to join project ${sid}`)
        await Site.findByIdAndUpdate(sid, { $pull: { requests: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { requests: sid } })
        return { success: true }
    } catch (error) {
        return error.message
    }
}

const cancelRequest = async (sid, uid) => {
    try {
        const site = await Site.findById(sid)
        if (site === null) throw new Error(`Site not found.`)
        if (!site.requests.includes(uid)) throw new Error(`User ${uid} didn't requested to join project ${sid}`)
        await Site.findByIdAndUpdate(sid, { $pull: { requests: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { requests: sid } })
        return { success: true, site }
    } catch (error) {
        return error.message
    }

}

const rejectInvitation = async (sid, uid) => {
    try {
        const site = await Site.findById(sid)
        if (site === null) throw new Error(`Site not found.`)
        if (!site.invitations.includes(uid)) throw new Error(`User ${uid} doesn't have invitation for project ${sid}`)
        await Site.findByIdAndUpdate(sid, { $pull: { invitations: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { invitations: sid } })
        return { success: true, site }
    } catch (error) {
        return error.message
    }
}

const cancelInvitation = async (sid, uid, aid) => {
    try {
        const site = await Site.findOne({ _id: sid, creator: aid })
        if (site === null) throw new Error(`Site not found or admin mismatch. Site: ${sid}. Admin: ${aid}`)
        if (!site.invitations.includes(uid)) throw new Error(`User ${uid} doesn't have invitation for project ${sid}`)
        await Site.findByIdAndUpdate(sid, { $pull: { invitations: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { invitations: sid } })
        return { success: true }
    } catch (error) {
        return error.message
    }
}
const searchProjects = async(pattern, page) => {
    const limit = 5
    const skip = page * limit
    const projects = await Site.find({
        name: {
            $regex: pattern, 
            $options: 'i'
        }},
        'name description creator createdAt'
    ).populate({
        path: 'creator',
        select: 'name'
    }).skip(skip).limit(limit)

    return { success: projects.length > 0, projects}
}

const updateProfileData = async (uid, data) => {
    const newData = await User.findByIdAndUpdate(uid, data, { new: true })
    return newData
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
    rejectRequest,
    searchProjects,
    updateProfileData
}