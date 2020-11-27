const mockUsers = require("./mock-users")
const mockGroups = require("./mock-groups")
const registeredUsers = [...new Set(mockUsers.map(x => x.name)), "test", "test2", "test3", "test4"] // get registered users form mock
const registeredGroups = [...new Set(mockGroups.map(x => x.name))] // get registered groups form mock

const models = require('./models')

module.exports = io => {
    // names cache keeps track of connected users and their assigned socket id
    // It's an object with username as property key and socket id as property value 
    // it is updated on every connect and disconnect 
    const nameToSocketIdCache = {}
    let clientsCount = 0

    io.on("connect", async (socket) => {
        // this first check should be done at rest api to avoid unnecessary connections but may be left in case of leaks
        // console.log(socket.handshake);
        queryName = socket.handshake.query.username
        if (!registeredUsers.includes(queryName)) {
            console.log(`[${getTime()}] Connect @ ${socket.id}. Connection refused (Unknown username: ${queryName})`)
            socket.disconnect()
            return
        }
        nameToSocketIdCache[queryName] = socket.id
        clientsCount++
        console.log(`[${getTime()}] Connect @ ${socket.id} (${queryName}). Total connections in pool: ${clientsCount}.`)
        socket.userData = {} // initialize empty object for user data from DB
        // let {groups, chats} = mockUsers.find(x => x.name === queryName) // fetch DB
        let userData = await models.User.findOne({
            username: queryName
        }, 'groups chats').populate({
            path: 'chats',
            select: "username -_id"
        }).populate({
            path: 'groups',
            select: "name -_id"
        })
        // console.log(user);

        socket.userData.name = queryName
        socket.userData.groups = {}
        // socket.userData.chats = cleanFalseChats(chats, queryName)
        socket.userData.chats = userData.chats.map(chat => chat.username)

        // groups = cleanFalseGroups(groups, queryName) // temporary (to remove dubs from mock db)
        let groups = userData.groups.map(group => group.name)

        let groupData = await models.Group.find({
            name: { $in: groups }
        }, 'name members').populate({ path: 'members', select: 'username -_id' })

        let groupMembers = {}
        groupData.map(o => groupMembers[[o.name]] = o.members.map(m => m.username))

        console.log(groupMembers);
        // console.log(groupData);

        // console.log(groups);
        socket.join(groups)
        
        // await Promise.all(groups.map(async (group) => {
        //     let members = await getMembers(group)
        //     let online = io.sockets.adapter.rooms.get(group) || new Set()
        //     online = [...online].map(sid => io.sockets.sockets.get(sid).userData.name) // React likes Array
        //     socket.userData.groups[group] = {
        //         online,
        //         offline: members ? members.filter(member => !online.includes(member)) : []
        //     }
        // }))

        Object.entries(groupMembers).forEach(([group , members]) => {
            // console.log(group);
            let online = io.sockets.adapter.rooms.get(group) || new Set()
            online = [...online].map(sid => io.sockets.sockets.get(sid).userData.name) // React likes Array
            socket.userData.groups[group] = {
                online,
                offline: members ? members.filter(member => !online.includes(member)) : []
            }
        })

        // console.log("groups", socket.userData.groups);
        // Welcome message from server to connected client
        // Send groups and chats to client for UI setup
        await socket.emit("welcome-message", {
            groups: socket.userData.groups,
            chats: socket.userData.chats
        })

        // send join message to group online members so they could update their userlists
        await groups.forEach(group => {
            socket.to(group).emit("join-message", { user: socket.userData.name, group })
        })

        // Notify users on disconnect
        socket.on("disconnecting", (reason) => {
            // console.log(`[${getTime()}] User ${socket.userData.name} has quit server (${reason})`)
            delete nameToSocketIdCache[socket.userData.name]
            clientsCount--
            console.log(`[${getTime()}] Disconnect @ ${socket.id} (${socket.userData.name}). Reason: ${reason}. Total connections in pool: ${clientsCount}.`)
            // send message to user groups that he quit
            groups.forEach(group => {
                socket.to(group).emit("quit-message", { user: socket.userData.name, reason, group })
            })
        })


        // Get message from client and send to rest clients
        socket.on("group-chat-message", ({ msg, recipient }, callback) => {
            console.log(`[${getTime()}] Message (group): ${socket.userData.name} >> ${recipient}`)
            socket.to(recipient).emit("group-chat-message", { user: socket.userData.name, msg, group: recipient })
            callback()
        })

        socket.on("single-chat-message", ({ msg, recipient }, callback) => {
            if (nameToSocketIdCache[recipient]) {
                console.log(`[${getTime()}] Message (private): ${socket.userData.name} >> ${recipient}`)
                io.to(nameToSocketIdCache[recipient]).emit("single-chat-message", { user: socket.userData.name, msg })
            } else {
                // send offline msg to DB if not in blacklist
                console.log(`[${getTime()}] Message (offline): ${socket.userData.name} >> ${recipient}`)
            }
            callback()
        })

        socket.on("join-request", ({ group }, callback) => {
            let msg = ''
            let requestedGroup = mockGroups.find(x => x.name === group) // fetch
            if (!requestedGroup) {
                msg = `${group} doesn't exist`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
            } else if (!requestedGroup.open && !requestedGroup.members.includes(socket.userData.name)) {
                msg = `${group} is closed`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
            } else if (Object.keys(socket.userData.groups).includes(requestedGroup.name)) {
                msg = `Already there`
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Refused: ${msg}`)
                callback(false, msg)
            } else {
                console.log(`[${getTime()}] Join request: ${socket.userData.name} >> ${group}. Success.`)
                socket.join(group)
                let members = cleanFalseMembers(requestedGroup.members, group)
                let online = io.sockets.adapter.rooms.get(group) || new Set()
                online = [...online].map(sid => io.sockets.sockets.get(sid).userData.name)
                socket.userData.groups[group] = {
                    online,
                    offline: members ? members.filter(member => !online.includes(member)) : []
                }
                socket.to(group).emit("join-message", { user: socket.userData.name, group })
                callback(true, socket.userData.groups)
            }
        })
    })
}


function getTime() {
    return new Date().toLocaleTimeString()
}

async function getMembers(group) {
    let groupData = await models.Group.findOne({
        name: group
    }, 'members').populate({ path: 'members', select: 'username -_id' })
    // console.log(groupData)
    let members = groupData.members.map(member => member.username)
    return members
}
// next three function has to do with mock data

//remove dublicate, non-existent or missing-me-from-group-members groups
function cleanFalseGroups(groups, me) {
    groups = new Set(groups)
    groups.forEach(group => (!registeredGroups.includes(group) || !mockGroups.find(x => x.name === group).members.includes(me)) && groups.delete(group))
    return [...groups]
}

//remove dublicate, non-existent or missing-group-from-group-list member
function cleanFalseMembers(members, group) {
    members = new Set(members)
    members.forEach(member => (!registeredUsers.includes(member) || !mockUsers.find(x => x.name === member).groups.includes(group)) && members.delete(member))
    return [...members]
}

//remove dublicate, self or non-existent-user chats
function cleanFalseChats(chats, me) {
    chats = new Set(chats)
    chats.forEach(chat => (!registeredUsers.includes(chat) || chat === me) && chats.delete(chat))
    return [...chats]
}
