const createUserData = (userData, messagePool) => {
    const siteCache = {}
    // let allMembers = new Set([userData._id.toString()])
    const clientData = {
        sites: {},
        chats: {},
        personal: {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            username: userData.username,
            company: userData.company,
            position: userData.position,
            picture: userData.picture
        },
        associatedUsers: {
            [userData._id]: {
                username: userData.username,
                name: userData.name,
                picture: userData.picture
            }
        }
    }
    if (userData.invitations) clientData.invitations = userData.invitations
    if (userData.requests) clientData.requests = userData.requests

    userData.chats.forEach(chat => {
        clientData.associatedUsers[chat._id] = {
            username: chat.username,
            name: chat.name,
            picture: chat.picture
        }
    })

    userData.groups.forEach(({ _id, name, site, members }) => {
        // members.map(member => allMembers.add(member._id.toString()))
        members.map(member => clientData.associatedUsers[member._id] = {
            username: member.username,
            name: member.name,
            picture: member.picture
        })
        siteCache[_id] = site._id
        if (!clientData.sites[site._id]) {
            clientData.sites[site._id] = {
                name: site.name,
                creator: site.creator,
                groups: {}
            }
            if (site.creator.toString() === userData._id.toString()) {
                // site.invitations.map(invitation => allMembers.add(invitation._id.toString()))
                site.invitations.map(invitation => clientData.associatedUsers[invitation._id] = {
                    username: invitation.username,
                    name: invitation.name,
                    picture: invitation.picture
                })
                // site.requests.map(request => allMembers.add(request._id.toString()))
                site.requests.map(request => clientData.associatedUsers[request._id] = {
                    username: request.username,
                    name: request.name,
                    picture: request.picture
                })
                clientData.sites[site._id].invitations = site.invitations || []
                clientData.sites[site._id].requests = site.requests || []
            }
        }
        clientData.sites[site._id].groups[_id] = {
            name,
            members: members.map(m => m._id.toString()),
            messages: []
        }
    })

    messagePool.forEach(msg => {
        let own = msg.source._id.toString() === userData._id.toString() // boolean
        switch (msg.onModel) {
            case "User":
                // determine who is the other party in conversation
                let partyID = own ? msg.destination._id.toString() : msg.source._id.toString()
                let partyName = own ? msg.destination.name : msg.source.name
                if (!clientData.chats[partyID]) {
                    clientData.chats[partyID] = {
                        username: partyName,
                        messages: []
                    }
                }
                clientData.chats[partyID].messages.push({
                    user: msg.source.name,
                    // added because username is unique, could be replaced by id
                    // purpose is to map profile pics to user who created message
                    username: msg.source.username,
                    msg: msg.content,
                    timestamp: msg.createdAt,
                    own
                })
                break;

            case "Group":
                clientData.sites[siteCache[msg.destination._id]].groups[msg.destination._id].messages.push({
                    user: msg.source.name,
                    // added because username is unique, could be replaced by id
                    // purpose is to map profile pics to user who created message
                    username: msg.source.username,
                    msg: msg.content,
                    timestamp: msg.createdAt,
                    own
                })
                break;

            default:
                break;
        }
    })

    console.log(clientData.associatedUsers)
    const allMembers = Object.keys(clientData.associatedUsers)
    return { clientData, allMembers, siteCache }
}

module.exports = createUserData