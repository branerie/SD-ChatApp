export default function UserDataReducer(userData, action) {
    switch (action.type) {
        // case "connect-message":
        //     break

        case "welcome-message": {
            let activeSite = Object.keys(action.payload.userData.sites)[0]
            let activeGroup = Object.keys(action.payload.userData.sites[activeSite].groups)[0]
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
                activeChat: action.payload.chat
            }
        }

        case "join-group": { // create and join group
            let { site, groupID, groupData } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [site]: {
                        ...userData.sites[site],
                        groups: {
                            ...userData.sites[site].groups,
                            [groupID]: {
                                ...groupData
                            }
                        }
                    }
                },
                activeGroup: groupID,
                activeChat: false
            }
        }

        case "create-site": { // create site and join general group
            let { siteID, siteData, groupID } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    [siteID]: {
                        ...siteData
                    }
                },
                activeSite: siteID,
                activeGroup: groupID,
                activeChat: false
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
            let { user, msg, group } = action.payload
            return {
                ...userData,
                chats: {
                    ...userData.chats,
                    [group]: {
                        ...userData.chats[group],
                        messages: [
                            ...userData.chats[group].messages,
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

        case "load-members": {
            let { site, group, members } = action.payload
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
                                members: {
                                    ...members
                                }
                            }
                        }
                    }
                }
            }
        }

        case "join-message": {
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

        case "invite-message": {
            return {
                ...userData,
                invitations: [
                    ...userData.invitations || [],
                    action.payload.siteData
                ]
            }
        }

        //     case "join-request-message":
        //         break

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