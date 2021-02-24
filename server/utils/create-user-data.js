const createUserData = (userData, messagePool) => {
    const siteCache = {}
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
            picture: userData.picture,
            theme: userData.theme || 'light' //patch for current users
        },
        associatedUsers: {
            [userData._id]: {
                username: userData.username,
                name: userData.name,
                picture: userData.picture,
                online: true
            }
        }
    }
    if (userData.invitations) clientData.invitations = userData.invitations
    if (userData.requests) clientData.requests = userData.requests

    userData.chats.forEach(chat => {
        clientData.associatedUsers[chat._id] = {
            username: chat.username,
            name: chat.name,
            picture: chat.picture,
            online: false
        }
    })

    userData.groups.forEach(({ _id, name, site, members }) => {
        let groupMembers = []
        members.map(member => {
            groupMembers.push(member._id)
            if (!clientData.associatedUsers[member._id]) {
                clientData.associatedUsers[member._id] = {
                    username: member.username,
                    name: member.name,
                    picture: member.picture,
                    online: false
                }
            }
        })
        siteCache[_id] = site._id
        if (!clientData.sites[site._id]) {
            clientData.sites[site._id] = {
                name: site.name,
                description: site.description,
                creator: site.creator,
                groups: {}
            }
            if (site.creator.toString() === userData._id.toString()) {
                clientData.sites[site._id].invitations = []
                clientData.sites[site._id].requests = []
                site.invitations.map(invitation => {
                    clientData.sites[site._id].invitations.push(invitation._id)
                    if (!clientData.associatedUsers[invitation._id]) {
                        clientData.associatedUsers[invitation._id] = {
                            username: invitation.username,
                            name: invitation.name,
                            picture: invitation.picture,
                            online: false
                        }
                    }
                })
                site.requests.map(request => {
                    clientData.sites[site._id].requests.push(request._id)
                    if (!clientData.associatedUsers[request._id]) {
                        clientData.associatedUsers[request._id] = {
                            username: request.username,
                            name: request.name,
                            picture: request.picture,
                            online: false
                        }
                    }
                })
            }
        }
        clientData.sites[site._id].groups[_id] = {
            name,
            members: groupMembers,
            messages: []
        }
    })

    messagePool.forEach(msg => {
        switch (msg.onModel) {
            case "User":
                // determine who is the other party in conversation
                let own = msg.source._id.toString() === userData._id.toString() // boolean
                let partyID = own ? msg.destination._id.toString() : msg.source._id.toString()
                if (!clientData.chats[partyID]) clientData.chats[partyID] = { messages: [] }
                clientData.chats[partyID].messages.push({
                    src: msg.source._id,
                    msg: msg.content,
                    timestamp: msg.createdAt
                })
                break;

            case "Group":
                // future implementation of removing users from groups shoud fix situation
                // when there are messages from these users that are not anymore in the group
                if (!clientData.associatedUsers[msg.source._id]) {
                    clientData.associatedUsers[msg.source._id] = {
                        username: msg.source.username,
                        name: msg.source.name,
                        picture: msg.source.picture,
                        online: false
                    }
                }
                clientData.sites[siteCache[msg.destination._id]].groups[msg.destination._id].messages.push({                    
                    src: msg.source._id,
                    msg: msg.content,
                    timestamp: msg.createdAt
                })
                break;

            default:
                break;
        }
    })

    return clientData
}

module.exports = createUserData