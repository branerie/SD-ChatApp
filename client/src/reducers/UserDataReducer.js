export default function UserDataReducer(userData, action) {
    switch (action.type) {
        // case "connect-message":
        //     break

        case "welcome-message": {
            // let activeSite = Object.keys(action.payload.userData.sites)[0] || false
            // let activeGroup = activeSite ? Object.keys(action.payload.userData.sites[activeSite].groups)[0] : false
            // load home page with search for projects and users?
            return {
                ...action.payload.userData,
                activeSite: false,
                activeGroup: false,
                activeChat: false
            }
        }

        case "load-projects": {
            return {
                ...userData,
                activeSite: false,
                activeGroup: false,
                activeChat: false
            }
        }
        case "load-site": { // load selected site data
            let activeSite = action.payload.site
            let activeGroup = Object.keys(userData.sites[activeSite].groups)[0]
            return {
                ...userData,
                activeSite,
                activeGroup,
                activeChat: false
            }
        }

        case "load-group": { // load selected group data
            const { activeGroup } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [userData.activeSite]: {
                        ...userData.sites[userData.activeSite],
                        groups: {
                            ...userData.sites[userData.activeSite].groups,
                            [activeGroup]: {
                                ...userData.sites[userData.activeSite].groups[activeGroup],
                                unread: false
                            }
                        }
                    },
                },
                activeGroup,
                activeChat: false
            }
        }

        case "load-chat": { // load selected chat data
            return {
                ...userData,
                chats: {
                    ...userData.chats,
                    [action.payload.chat]: {
                        ...userData.chats[action.payload.chat],
                        unread: false
                    }
                },
                activeSite: false,
                activeGroup: false,
                activeChat: action.payload.chat
            }
        }

        case "open-chat": {
            let { user } = action.payload
            return {
                ...userData,
                chats: {
                    ...userData.chats,
                    [user._id]: {
                        username: user.name,
                        messages: userData.chats[user._id] ? userData.chats[user._id].messages : [],
                        unread: false
                    }
                },
                activeSite: false,
                activeGroup: false,
                activeChat: user._id
            }
        }

        case 'close-chat': {
            const { [action.payload.chat]: _, ...chats } = userData.chats
            return {
                ...userData,
                chats,
                ...(action.payload.chat === userData.activeChat) && { activeChat: false }
            }
        }

        case "create-group": { // create group
            let { site, groupData, activeConnection } = action.payload
            let activeGroup = Object.keys(groupData)[0]
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        groups: {
                            ...userData.sites[site].groups,
                            ...groupData
                        }
                    }
                },
                ...(activeConnection) && { activeGroup },
                ...(activeConnection) && { activeChat: false }
            }
        }

        case "create-site": { // create site and join general group
            let { siteData, activeConnection } = action.payload
            let activeSite = Object.keys(siteData)[0]
            let activeGroup = Object.keys(siteData[activeSite].groups)[0]
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    ...siteData
                },
                ...(activeConnection) && { activeSite },
                ...(activeConnection) && { activeGroup },
                ...(activeConnection) && { activeChat: false }
            }
        }

        case "group-chat-message": {
            let timestamp = new Date().toUTCString()
            let { site, group, msg, user } = action.payload
            let own = user === userData.personal._id
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        groups: {
                            ...userData.sites[site].groups,
                            [group]: {
                                ...userData.sites[site].groups[group],
                                unread: group !== userData.activeGroup && !own,
                                messages: [
                                    ...userData.sites[site].groups[group].messages,
                                    {
                                        user: userData.sites[site].groups[group].members.find(m => m._id === user).name,
                                        // added in order to fetch user avatar as username is unique (can be replaced with id)
                                        username: userData.sites[site].groups[group].members.find(m => m._id === user).username,
                                        msg,
                                        timestamp,
                                        own
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }

        case "single-chat-message": {
            let timestamp = new Date().toUTCString()
            let { user, username, chat, msg, own } = action.payload
            if (own) user = userData.personal.name
            return {
                ...userData,
                chats: {
                    ...userData.chats,
                    [chat]: {
                        ...(userData.chats[chat])
                            ? {
                                ...userData.chats[chat],
                                messages: [
                                    ...userData.chats[chat].messages || [],
                                    { user, username, msg, timestamp, own }
                                ],
                                unread: chat !== userData.activeChat && !own
                            }
                            : {
                                username: user,
                                messages: [
                                    { user, username, msg, timestamp, own }
                                ],
                                unread: true
                            }
                    }
                }
            }
        }

        case "online-message": {
            let timestamp = new Date().toUTCString()
            let { user, site, group } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        groups: {
                            ...userData.sites[site].groups,
                            [group]: {
                                ...userData.sites[site].groups[group],
                                messages: [
                                    ...userData.sites[site].groups[group].messages,
                                    {
                                        user: "SERVER",
                                        msg: `${user.name} is online.`,
                                        timestamp
                                    }
                                ],
                            }
                        }
                    }
                },
                onlineMembers: [...new Set([...userData.onlineMembers, user._id])]
            }
        }

        case "join-message": {
            let timestamp = new Date().toUTCString()
            let { user, online, site, group } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        ...(userData.sites[site].invitations) && { invitations: userData.sites[site].invitations.filter(i => i !== user._id) },
                        ...(userData.sites[site].requests) && { requests: userData.sites[site].requests.filter(i => i !== user._id) },
                        groups: {
                            ...userData.sites[site].groups,
                            [group]: {
                                ...userData.sites[site].groups[group],
                                members: [
                                    ...userData.sites[site].groups[group].members,
                                    user._id
                                ],
                                messages: [
                                    ...userData.sites[site].groups[group].messages,
                                    {
                                        user: "SERVER",
                                        msg: `${user.name} has joined.`,
                                        timestamp
                                    }
                                ],
                            }
                        }
                    }
                },
                ...(online) && { onlineMembers: [...new Set([...userData.onlineMembers, user._id])] },
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user._id]: {
                        username: user.username,
                        name: user.name,
                        picture: user.picture
                    }
                }
            }
        }

        case "quit-message": {
            let timestamp = new Date().toUTCString()
            let { user, site, group } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        groups: {
                            ...userData.sites[site].groups,
                            [group]: {
                                ...userData.sites[site].groups[group],
                                messages: [
                                    ...userData.sites[site].groups[group].messages,
                                    {
                                        user: "SERVER",
                                        msg: `${user.name} is offline.`,
                                        timestamp
                                    }
                                ],
                            }
                        }
                    }
                },
                onlineMembers: userData.onlineMembers.filter(m => m !== user._id)
            }
        }

        case "add-user-to-site-invitations": {
            let { user, site } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        invitations: [
                            ...userData.sites[site].invitations || [],
                            user._id
                        ]
                    }
                },                
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user._id]: {
                        username: user.username,
                        name: user.name,
                        picture: user.picture
                    }
                }
            }
        }

        case "remove-user-from-site-invitations": {
            let { user, site } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        invitations: userData.sites[site].invitations.filter(i => i !== user)
                    }
                },
            }
        }


        case "remove-user-from-site-requests": {
            let { user, site } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        requests: userData.sites[site].requests.filter(r => r !== user)
                    }
                },
            }
        }


        case "request-accepted": {
            let { site, associatedUsers, onlineMembers } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    ...site
                },
                requests: userData.requests.filter(r => r._id !== Object.keys(site)[0]),
                onlineMembers: [...new Set([...userData.onlineMembers, ...onlineMembers])],
                associatedUsers: {
                    ...userData.associatedUsers,
                    ...associatedUsers
                }
            }
        }


        case 'added-to-group': {
            let { site, group } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        groups: {
                            ...userData.sites[site].groups,
                            ...group
                        }
                    }
                },
            }
        }

        case "add-site-to-invitations": {
            return {
                ...userData,
                invitations: [
                    ...userData.invitations || [],
                    action.payload.siteData
                ]
            }
        }

        case "add-site-to-requests": {
            return {
                ...userData,
                requests: [
                    ...userData.requests || [],
                    action.payload.siteData
                ]
            }
        }

        case "remove-site-from-requests": {
            return {
                ...userData,
                requests: userData.requests.filter(r => r._id !== action.payload.site)
            }
        }

        case "remove-site-from-invitations": {
            return {
                ...userData,
                invitations: userData.invitations.filter(i => i._id !== action.payload.site)
            }
        }

        case "add-user-to-site-requests": {
            let { site, user } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        requests: [
                            ...userData.sites[site].requests || [],
                            user._id
                        ]
                    }
                },
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user._id]: {
                        username: user.username,
                        name: user.name,
                        picture: user.picture
                    }
                }
            }
        }


        case "invitation-accepted": {
            let { siteData, associatedUsers, onlineMembers, activeConnection } = action.payload
            let activeSite = Object.keys(siteData)[0]
            let activeGroup = Object.keys(siteData[activeSite].groups)[0]
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    ...siteData
                },
                invitations: userData.invitations.filter(i => i._id !== Object.keys(siteData)[0]) || [],
                onlineMembers: [...new Set([...userData.onlineMembers, ...onlineMembers])],
                associatedUsers: {
                    ...userData.associatedUsers,
                    ...associatedUsers
                },
                ...(activeConnection) && { activeSite },
                ...(activeConnection) && { activeGroup },
                ...(activeConnection) && { activeChat: false }
            }
        }

        case "update-profile-data": {
            return {
                ...userData,
                personal: {
                    ...userData.personal,
                    ...action.payload.newData
                }
            }
        }

        case "show-info": {
            const { user } = action.payload
            return {
                ...userData,
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user]: {
                        ...userData.associatedUsers[user],
                        info: !userData.associatedUsers[user].info
                    }
                }
            }
        }

        case "disconnect-message": {
            return false
        }

        // case "reconnect-attempt-message":
        //     break

        // case "reconnect-error-message":
        //     break

        // case "reconnect-failed-message":
        //     break

        // case "reconnect-message":
        //     break

        default:
            return userData
    }
}