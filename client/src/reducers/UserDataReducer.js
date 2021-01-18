export default function UserDataReducer(userData, action) {
    switch (action.type) {
        // case "connect-message":
        //     break

        case "welcome-message": {
            let activeSite = Object.keys(action.payload.userData.sites)[0] || false
            let activeGroup = activeSite ? Object.keys(action.payload.userData.sites[activeSite].groups)[0] : false
            return {
                ...action.payload.userData,
                activeSite,
                activeGroup,
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
            return {
                ...userData,
                activeGroup: action.payload.group,
                activeChat: false
            }
        }

        case "load-chat": { // load selected chat data
            return {
                ...userData,
                activeSite: false,
                activeGroup: false,
                activeChat: action.payload.chat
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
            let timestamp = new Date().toLocaleTimeString()
            let { site, group, msg, user } = action.payload
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
                                        user,
                                        msg,
                                        timestamp
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }

        case "single-chat-message": {
            let timestamp = new Date().toLocaleTimeString()
            let { user, chat, msg } = action.payload
            return {
                ...userData,
                chats: {
                    ...userData.chats,
                    [chat]: {
                        ...userData.chats[chat],
                        messages: [
                            ...userData.chats[chat].messages,
                            {
                                user,
                                msg,
                                timestamp
                            }
                        ]
                    }
                }
            }
        }

        case "online-message": {
            let timestamp = new Date().toLocaleTimeString()
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
                                        msg: `${user.username} is online.`,
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
            let timestamp = new Date().toLocaleTimeString()
            let { user, online, site, group } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        ...(userData.sites[site].invitations) && { invitations: userData.sites[site].invitations.filter(i => i._id !== user._id) },
                        ...(userData.sites[site].requests) && { requests: userData.sites[site].requests.filter(i => i._id !== user._id) },
                        groups: {
                            ...userData.sites[site].groups,
                            [group]: {
                                ...userData.sites[site].groups[group],
                                members: [
                                    ...userData.sites[site].groups[group].members,
                                    user
                                ],
                                messages: [
                                    ...userData.sites[site].groups[group].messages,
                                    {
                                        user: "SERVER",
                                        msg: `${user.username} has joined.`,
                                        timestamp
                                    }
                                ],
                            }
                        }
                    }
                },
                ...(online) && { onlineMembers: [...new Set([...userData.onlineMembers, user._id])] }
            }
        }

        case "quit-message": {
            let timestamp = new Date().toLocaleTimeString()
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
                                        msg: `${user.username} is offline.`,
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

        case "invite-user": {
            let { user, site } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        invitations: [
                            ...userData.sites[site].invitations || [],
                            user
                        ]
                    }
                },
            }
        }


        case "cancel-invitation": {
            let { invitation, site } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        invitations: userData.sites[site].invitations.filter(i => i._id !== invitation._id)
                    }
                },
            }
        }


        case "accept-request":
        case "reject-request": {
            let { request, site } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        requests: userData.sites[site].requests.filter(r => r._id !== request._id)
                    }
                },
            }
        }


        case "request-accepted": {
            let { site, onlineMembers } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    ...site
                },
                onlineMembers: [...new Set([...userData.onlineMembers, ...onlineMembers])],
                requests: userData.requests.filter(r => r._id !== Object.keys(site)[0]),
            }
        }


        case 'added-to-group': {
            let { site, group } = action.payload
            console.log(group);
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

        case "invite-message": {
            return {
                ...userData,
                invitations: [
                    ...userData.invitations || [],
                    action.payload.siteData
                ]
            }
        }

        case "send-request": {
            return {
                ...userData,
                requests: [
                    ...userData.requests || [],
                    action.payload.siteData
                ]
            }
        }

        case "cancel-request": {
            return {
                ...userData,
                requests: userData.requests.filter(r => r._id !== action.payload.request._id)
            }
        }

        case "reject-invitation": {
            return {
                ...userData,
                invitations: userData.invitations.filter(i => i._id !== action.payload.invitation._id)
            }
        }

        case "request-message": {
            let { site, user } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        requests: [
                            ...userData.sites[site].requests || [],
                            user
                        ]
                    }
                },
            }
        }


        case "accept-invitation": {
            let { siteData, onlineMembers, activeConnection } = action.payload
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
                ...(activeConnection) && { activeSite },
                ...(activeConnection) && { activeGroup },
                ...(activeConnection) && { activeChat: false }
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