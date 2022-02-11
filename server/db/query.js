const { User, Site, Group, Message } = require('../models')
const UserError = require('../errors/user')

const registerUser = async (username, password) => {
    try {
        const user = new User({
            username,
            password
        })

        const userObject = await user.save()
        return { success: true, userObject }
    } catch (error) {
        if (error.code === 11000) {
            return { success: false, error: ['Username already registered.'] }
        }

        return { success: false, error: error.message } 
    }
}

const loginUser = async (username) => {
    const userObject = await User.findOne({ username })
    return userObject
}

const verifyUser = async (id) => {
    const user = await User.findById(id)
    return user
}

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
            select: 'name description logo creator invitations requests',
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
            { source: uid, destination: id, onModel: 'User' },
            { source: id, destination: uid, onModel: 'User' },
        ]
    }, '-_id -__v -updatedAt').populate({
        path: 'source',
        select: 'name username'
    }).lean()

    return { messages, username: party.name }
}

const getGroupMessages = async (gid) => {
    const messages = await Message.find({ destination: gid, onModel: 'Group' }, '-_id -__v -updatedAt').populate({
        path: 'source',
        select: 'name username'
    }).lean()
    return messages
}

const createPublicMessage = async (src, dst, msg, type) => {
    // check if group is valid and if user has access to it
    try {
        const group = await Group.findById(dst)
        if (group === null) throw new Error(`Group ${dst} not found.`)
        if (!group.members.includes(src)) throw new Error(`Membership in ${dst} not found.`)
        // console.log(group);
        let message = new Message({
            source: src,
            destination: dst,
            onModel: 'Group',
            content: msg,
            type
        })
        const details = await message.save()
        return { success: true, details, site: group.site }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

const removeChat = async (id, chat) => {
    try {
        await User.findByIdAndUpdate(id, { $pullAll: { chats: [chat] } })
    } catch (error) {
        console.error(error.message);
    }
}

const createPrivateMessage = async (src, dst, msg, type) => {
    try {
        // blacklist validation ?
        await User.findByIdAndUpdate(src, { $addToSet: { chats: [dst] } })
        await User.findByIdAndUpdate(dst, { $addToSet: { chats: [src] } })
        let message = new Message({
            source: src,
            destination: dst,
            onModel: 'User',
            content: msg,
            type
        })
        let details = await message.save()
        return { success: true, details }
    } catch (error) {
        return { success: false, error: error.message }
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

const createSite = async (name, description, creator) => {
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

const updateProjectSettings = async (aid, sid, name, description, logo) => {
    try {
        const siteCheck = await verifySitePrivileges(sid, aid)
        if (siteCheck.error) throw new Error(siteCheck.error)

        const filters = { _id: sid, creator: aid }
        const updates = { name, description, logo }
        const options = { new: true, runValidators: true }

        const site = await Site.findOneAndUpdate(filters, updates, options)
        return { site }
    } catch (error) {
        if (error.name === 'ValidationError') {
            const userErrors = Object.keys(error.errors).map(e => error.errors[e].message)
            return { error: userErrors, userErrors }
        }
        return { error: error.message }
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
    const groupCheck = await Group.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") }, site })
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
        return { success: false, message: error.message }
    }
}

const changeGroupName = async (gid, name, aid) => {
    try {
        const groupCheck = await Group.findOne({ _id: gid, creator: aid })
        if (groupCheck === null) throw new Error('Permission error')
    
        const nameCheck = await Group.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") }, site: groupCheck.site })
        if (nameCheck !== null) throw new UserError('Group exists')
    
        const filters = { _id: gid, creator: aid }
        const updates = { name }
        const options = { new: true, runValidators: true }

        const group = await Group.findOneAndUpdate(filters, updates, options)
        return { group }
        
    } catch (error) {
        if (error instanceof UserError) return { error: error.message , userErrors: [error.message]}
        return { error: error.message }
    }
}

const addUserToGroup = async (uid, gid, aid, online) => {
    try {
        // check if group created by admin exists
        const groupData = await Group.findOne({ _id: gid, creator: aid })
        if (groupData === null) throw new Error(`Group not found or admin mismatch. Group: ${gid}. Admin: ${aid}.`)
        // check if user is valid and exists
        const userData = await User.findById(uid, 'name username picture')
        if (userData === null) throw new Error(`User ${uid} not found`)
        // check if user is not already a member of this group
        if (groupData.members.includes(uid)) throw new Error(`User ${uid} is already part of group ${gid}.`)
        // finally check if user is a member of project (project general group)
        const generalGroup = await Group.findOne({ site: groupData.site, name: 'General' }, 'members')
        if (!generalGroup.members.includes(uid)) throw new Error(`User ${uid} is not a member of project ${groupData.site}`)

        await User.findByIdAndUpdate(uid, { $addToSet: { groups: [gid] } })
        await Group.findByIdAndUpdate(gid, { $addToSet: { members: [uid] } })
        const messages = online ? await getGroupMessages(gid) : []
        return { userData, groupData, messages }
    } catch (error) {
        if (error.name === "CastError") return { error: `CastError: ${error.message}` }
        return { error: error.message }
    }
}

const removeUserFromGroup = async (uid, gid, aid) => {
    try {
        // try not to remove yourself
        if (uid.toString() === aid.toString()) throw new Error(`${aid}: Can't remove admin.`)
        // check if group created by admin exists
        const groupData = await Group.findOne({ _id: gid, creator: aid })
        if (groupData === null) throw new Error(`Group not found or admin mismatch. Group: ${gid}. Admin: ${aid}.`)
        // check if user is valid and exists
        const userData = await User.findById(uid)
        if (userData === null) throw new Error(`User ${uid} not found`)
        // check if user is a member of this group
        if (!groupData.members.includes(uid)) throw new Error(`User ${uid} is not part of group ${gid}.`)

        if (groupData.name === 'General') {
            const matchingGroups = await Group.find({ site: groupData.site, members: uid })
            const groupIds = matchingGroups.map(m => m._id)
            await Group.updateMany({
                site: groupData.site,
                members: uid
            }, { $pull: { members: uid } })
            await User.findByIdAndUpdate(uid, { $pullAll: { groups: groupIds } })
            return { site: groupData.site, groups: groupIds.map(String), event: 'removed-from-project' }
        } else {
            await User.findByIdAndUpdate(uid, { $pull: { groups: gid } })
            await Group.findByIdAndUpdate(gid, { $pull: { members: uid } })
            return { site: groupData.site, groups: [gid], event: 'removed-from-group' }
        }
    } catch (error) {
        if (error.name === "CastError") return { error: `CastError: ${error.message}` }
        return { error: error.message }
    }
}

async function verifySitePrivileges(sid, aid) {
    try {
        const data = await Site.findById(sid)
        if (data === null) throw new Error(`Site ${sid} not found.`)
        if (data.creator.toString() !== aid.toString()) throw new Error(`Admin mismatch. Site: ${sid}. Admin: ${aid}`)
        return data
    } catch (error) {
        if (error.name === "CastError") return { error: `CastError: ${error.message}` }
        return { error: error.message }
    }
}

const sendInvitation = async (uid, sid, aid) => {
    try {
        const site = await verifySitePrivileges(sid, aid)
        if (site.error) throw new Error(site.error)

        const user = await User.findById(uid, '-password')
        if (user === null) throw new Error(`User ${uid} not found.`)

        if (site.invitations.includes(uid)) throw new Error(`Invitation for user ${uid} is already pending.`)
        const generalGroup = await Group.findOne({ site: sid, name: "General" }, 'members')
        if (generalGroup.members.includes(uid)) throw new Error(`User ${uid} is already a member.`)

        if (user.requests && user.requests.includes(sid)) console.log("User should join general group immediately") //todo

        await Site.findByIdAndUpdate(sid, { $addToSet: { invitations: [uid] } })
        await User.findByIdAndUpdate(uid, { $addToSet: { invitations: [sid] } })
        return { user, site }

    } catch (error) {
        return { error: error.message }
    }
}

const cancelInvitation = async (uid, sid, aid) => {
    try {
        const site = await verifySitePrivileges(sid, aid)
        if (site.error) throw new Error(site.error)

        if (!site.invitations.includes(uid)) throw new Error(`User ${uid} doesn't have invitation for project ${sid}`)

        await Site.findByIdAndUpdate(sid, { $pull: { invitations: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { invitations: sid } })
        return true
    } catch (error) {
        return { error: error.message }
    }
}

const acceptRequest = async (uid, sid, aid, online) => {
    try {
        const site = await verifySitePrivileges(sid, aid)
        if (site.error) throw new Error(site.error)

        const user = await User.findById(uid)
        if (user === null) throw new Error(`User ${uid} not found`)

        if (!site.requests.includes(uid)) throw new Error(`Request from ${uid} to ${sid} not found.`)

        const group = await Group.findOne({ site: sid, name: "General" }).populate({ path: 'members', select: 'name username picture' })
        if (group.members.map(m => m._id).includes(uid)) throw new Error(`User ${uid} is already a member.`)

        await syncUserAndProjectData(uid, group._id, sid)
        const messages = online ? await getGroupMessages(group._id) : []
        return { user, site, group, messages }
    } catch (error) {
        return { error: error.message }
    }
}

const rejectRequest = async (uid, sid, aid) => {
    try {
        const site = await verifySitePrivileges(sid, aid)
        if (site.error) throw new Error(site.error)

        if (!site.requests.includes(uid)) throw new Error(`User ${uid} didn't requested to join project ${sid}`)

        await Site.findByIdAndUpdate(sid, { $pull: { requests: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { requests: sid } })
        return true
    } catch (error) {
        return { error: error.message }
    }
}

const sendRequest = async (sid, uid) => {
    try {
        const site = await Site.findById(sid)
        if (site === null) throw new Error(`${sid} not found.`)

        const generalGroup = await Group.findOne({ site: sid, name: "General" }, 'members')
        if (generalGroup.members.includes(uid)) throw new Error(`You are already a member.`)

        if (site.requests && site.requests.includes(uid)) throw new Error(`Request already exist.`)

        if (site.invitations && site.invitations.includes(uid)) console.log("User should join general group immediately") // todo

        await Site.findByIdAndUpdate(sid, { $addToSet: { requests: [uid] } })
        await User.findByIdAndUpdate(uid, { $addToSet: { requests: [sid] } })
        return { site }

    } catch (error) {
        return { error: error.message }
    }
}

const cancelRequest = async (sid, uid) => {
    try {
        const site = await Site.findById(sid)
        if (site === null) throw new Error(`${sid} not found.`)

        if (!site.requests.includes(uid)) throw new Error(`User ${uid} didn't requested to join project ${sid}`)

        await Site.findByIdAndUpdate(sid, { $pull: { requests: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { requests: sid } })
        return { site }
    } catch (error) {
        return { error: error.message }
    }

}

const acceptInvitation = async (sid, uid) => {
    try {
        const site = await Site.findById(sid)
        if (site === null) throw new Error(`${sid} not found.`)

        if (!site.invitations.includes(uid)) throw new Error(`User ${uid} doesn't have invitation for project ${sid}`)

        const group = await Group.findOne({ site: sid, name: "General" }).populate({ path: 'members', select: 'name username picture' })
        if (group.members.map(m => m._id).includes(uid)) throw new Error(`You are already a member.`)

        await syncUserAndProjectData(uid, group._id, sid)
        const messages = await getGroupMessages(group._id)
        return { site, group, messages }
    } catch (error) {
        return { error: error.message }
    }
}

const rejectInvitation = async (sid, uid) => {
    try {
        const site = await Site.findById(sid)
        if (site === null) throw new Error(`${sid} not found.`)

        if (!site.invitations.includes(uid)) throw new Error(`User ${uid} doesn't have invitation for project ${sid}`)

        await Site.findByIdAndUpdate(sid, { $pull: { invitations: uid } })
        await User.findByIdAndUpdate(uid, { $pull: { invitations: sid } })
        return { site }
    } catch (error) {
        return { error: error.message }
    }
}

const searchProjects = async (uid, pattern, page) => {
    const limit = 5
    const skip = page * limit
    const sites = await User.findById(uid, '-_id groups invitations requests').populate({
        path: 'groups',
        match: { name: 'General' },
        select: '-_id site'
    })
    const excludedSites = sites.groups.map(m => m.site).concat(sites.invitations, sites.requests)
    const projects = await Site.find({
        _id: {
            $nin: excludedSites
        },
        name: {
            $regex: pattern,
            $options: 'i'
        }
    },
        'name description creator createdAt'
    ).populate({
        path: 'creator',
        select: 'name'
    }).skip(skip).limit(limit + 1) // +1 dummy sacrifice check for more projects

    let success = projects.length > 0
    let more = projects.length === 6 // save and send bool if more projects found (in the name of UX)
    if (more) projects.pop()

    return { success, more, projects }
}

const searchPeople = async (pattern, page) => {
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

    // console.log(people);
    return { success: people.length > 0, people }
}

const updateProfileData = async (uid, data) => {
    const newData = await User.findByIdAndUpdate(uid, data, { new: true })
    // console.log(newData);
    return { name: newData.name, username: newData.username, picture: newData.picture }
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

const changeTheme = async (uid, theme) => {
    await User.findByIdAndUpdate(uid, { theme })
}

// const updateAccessTime = async (uid, gid) => {
//     const atime = await User.updateOne({_id: uid, 'groups.gid': gid}, { $set: { 'groups.$.atime': new Date() } })
//     console.log(atime)
// }


module.exports = {
    registerUser,
    loginUser,
    verifyUser,
    getUserData,
    getMessages,
    getPrivateMessages,
    removeChat,
    createPublicMessage,
    createPrivateMessage,
    createSite,
    createGroup,
    changeGroupName,
    sendInvitation,
    addUserToGroup,
    removeUserFromGroup,
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
    updateProjectSettings,
    changeTheme
    // updateAccessTime
}