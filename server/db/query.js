const { User, Site, Group, Message } = require('../models')

const getUserData = async (id) => {
    let data = await User.findById(id, '-password -__v').populate({
        path: 'chats',
        select: 'name username picture'
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
            select: 'name username picture'
        }, {
            path: 'site',
            select: 'name description creator invitations requests',
            populate: {
                path: 'invitations requests',
                select: 'name username picture'
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
    }, '-_id -__v -updatedAt').populate({ 
        path: 'source', 
        select: 'name username picture' 
    }).populate({ 
        path: 'destination', 
        select: 'name username' 
    }).lean()
    // console.log(messages);
    return messages
}

const getPrivateMessages = async (id, uid) => {
    const party = await User.findById(id)
    const messages = await Message.find({
        $or: [
            { destination: id, source: uid },
            { source: id, destination: uid },
        ]
    }, '-_id -__v -updatedAt').populate({ 
        path: 'source', 
        select: 'name username' 
    }).lean()
    
    return { messages, username: party.name }
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
        // await User.findByIdAndUpdate(creator, { $addToSet: { groups: [{gid: newGroup._id}] } })
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
    const groupCheck = await Group.findOne({ name: { $regex : new RegExp(`^${name}$`, "i") }, site })
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
        // await User.findByIdAndUpdate(creator, { $addToSet: { groups: [{gid: newGroup._id}] } })
        return { success: true, _id: newGroup._id }
    } catch (error) {
        // add validations in model and check for more errors
        return { success: false, message: 'error.code' }
    }
}

const inviteUser = async (username, sid, aid) => {
    try {
        // check userId from socket and compare to site creator
        const site = await Site.findById(sid, 'name creator invitations')
        if (site === null) throw new Error(`Site with id ${sid} not found. Illegal operation.`)
        if (site.creator.toString() !== aid.toString()) {
            throw new Error("Site creator doesn't match. Illegal operation.")
        }
        const user = await User.findOne({ username })
        if (user === null) throw new Error(`User ${username} not found.`)
        if (site.invitations.includes(user._id.toString())) {
            throw new Error(`Invitation for user ${user._id} (${username}) is already pending.`)
        }
        const generalGroup = await Group.findOne({ site: sid, name: "General" }, 'members')
        if (generalGroup.members.includes(user._id.toString())) throw new Error(`User ${username} is already a member.`)

        if (user.requests && user.requests.includes(sid)) console.log("User should join general group immediately") //todo

        await Site.findByIdAndUpdate(sid, { $addToSet: { invitations: [user._id] } })
        await User.findByIdAndUpdate(user._id, { $addToSet: { invitations: [site._id] } })
        return { success: true, userData: { _id: user._id, username, name: user.name, picture: user.picture }, siteData: { _id: site._id, name: site.name } }

    } catch (error) {
        return error.message
    }
}

const addUserToGroup = async (uid, sid, gid, aid) => {
    try {
        // check if site is valid and site admin match
        const siteData = await Site.findOne({ _id: sid, creator: aid })
        if (siteData === null) throw new Error(`Site not found or admin mismatch. Site: ${sid}. Admin: ${aid}`)
        // check if user is valid and exists
        const userData = await User.findById(uid)
        if (userData === null) throw new Error(`User ${uid} not found`)
        // check if user is a member of project (project general group)
        const generalGroup = await Group.findOne({ site: sid, name: 'General' }, 'members')
        if (!generalGroup.members.includes(uid)) throw new Error(`User ${uid} (${userData.username}) is not a member of project ${sid} (${siteData.name})`)
        // check if group exists and if user is not already a member of this group
        const groupData = await Group.findOne({ _id: gid, site: sid }).populate({ path: 'members', select: 'name username' })
        if (groupData === null) throw new Error(`Group ${gid} in project ${sid} not found`)
        if (groupData.members.map(m => m._id).includes(uid)) throw new Error(`User ${uid} (${userData.username}) is already part of group ${gid} (${groupData.name})`)

        await User.findByIdAndUpdate(uid, { $addToSet: { groups: [gid] } })
        await Group.findByIdAndUpdate(gid, { $addToSet: { members: [uid] } })
        return { success: true, userData, groupData }
    } catch (error) {
        if (error.name === "CastError") return `CastError: ${error.message}`
        return error.message
    }
}

const sendRequest = async (siteName, uid) => {
    try {
        const site = await Site.findOne({ name: siteName })
        if (site === null) throw new Error(`${siteName} doesn't exist.`)
        const generalGroup = await Group.findOne({ site: site._id, name: "General" }, 'members')
        if (generalGroup.members.includes(uid)) throw new Error(`You are already a member.`)
        if (site.requests && site.requests.includes(uid)) throw new Error(`Request already exist.`)

        if (site.invitations && site.invitations.includes(uid)) console.log("User should join general group immediately") // todo

        await Site.findByIdAndUpdate(site._id, { $addToSet: { requests: [uid] } })
        await User.findByIdAndUpdate(uid, { $addToSet: { requests: [site._id] } })
        return { success: true, site }

    } catch (error) {
        return error.message
    }
}

const acceptInvitation = async (sid, uid) => {
    try {
        const site = await Site.findById(sid)
        if (site === null) throw new Error(`${sid} doesn't exist.`)
        if (!site.invitations.includes(uid)) throw new Error(`User ${uid} doesn't have invitation for project ${sid}`)
        const generalGroup = await Group.findOne({ site: sid, name: "General" }).populate({ path: 'members', select: 'name username picture' })
        if (generalGroup.members.map(m => m._id).includes(uid)) throw new Error(`You are already a member.`)
        await syncUserAndProjectData(uid, generalGroup._id, sid)
        return { success: true, site, generalGroup } //? return data (group id,name and members)
    } catch (error) {
        return error.message
    }
}

const acceptRequest = async (sid, uid, aid) => {
    try {
        const site = await Site.findOne({ _id: sid, creator: aid })
        if (site === null) throw new Error(`Site not found or admin mismatch. Site: ${sid}. Admin: ${aid}`)
        if (!site.requests.includes(uid)) throw new Error(`User ${uid} didn't requested to join project ${sid}`)
        const generalGroup = await Group.findOne({ site: sid, name: "General" }).populate({ path: 'members', select: 'name username picture' })
        if (generalGroup.members.map(m => m._id).includes(uid)) throw new Error(`You are already a member.`)
        const userData = await User.findById(uid)
        if (userData === null) throw new Error(`User ${uid} not found`)
        await syncUserAndProjectData(uid, generalGroup._id, sid)
        return { success: true, site, generalGroup, userData } //? return data (group id,name and members)
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

const searchPeople = async(pattern, page) => {
    const limit = 5
    const skip = page * limit
    const people = await User.find({
        $or: [
            { name: { $regex: pattern, $options: 'i' } },
            { username: { $regex: pattern, $options: 'i' } },
            { email: { $regex: pattern, $options: 'i' } },
        ]
    },
        'name username picture company position'
    ).skip(skip).limit(limit)

    console.log(people);
    return { success: people.length > 0, people}
}

const updateProfileData = async (uid, data) => {
    const newData = await User.findByIdAndUpdate(uid, data, { new: true })
    return newData
}

const getUserDetails = async (uid) => {
    const user = await User.findById(uid)
    if (!user) throw new Error(`User with id ${uid} not found`)

    return {
        userId: uid,
        username: user.username,
        ...(user.name && { name: user.name }),
        ...(user.email && { email: user.email }),
        ...(user.company && { company: user.company }),
        ...(user.mobile && { mobile: user.mobile }),
        ...(user.position && { position: user.position }),
        ...(user.picture && { picture: user.picture }),
        ...(user.social && { social: user.social })
    }
}

// const updateAccessTime = async (uid, gid) => {
//     const atime = await User.updateOne({_id: uid, 'groups.gid': gid}, { $set: { 'groups.$.atime': new Date() } })
//     console.log(atime)
// }


module.exports = {
    getUserData,
    getMessages,
    getPrivateMessages,
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
    getUserDetails,
    searchProjects,
    searchPeople,
    updateProfileData,
    // updateAccessTime
}