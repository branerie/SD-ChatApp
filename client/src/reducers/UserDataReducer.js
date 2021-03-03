export default function UserDataReducer(userData, action) {
    switch (action.type) {
        // case 'connect-message':
        //     break

        case 'welcome-message': {
            return {
                ...action.payload.userData,
                activeSite: false,
                activeGroup: false,
                activeChat: false,
                activeMenu: 'projects',
                activeWindow: 'projects',
                device: setDevice()
            }
        }

        case 'change-theme': {
            const { theme } = action.payload
            return {
                ...userData,
                personal: {
                    ...userData.personal,
                    theme
                }
            }

        }

        case 'search-project': {
            return {
                ...userData,
                activeSite: false,
                activeGroup: false,
                activeChat: false,
                activeMenu: 'projects'
            }
        }

        case 'load-project-settings': {
            return {
                ...userData,
                // activeSite: false,
                // activeGroup: false,
                // activeChat: false,
                activeMenu: 'settings'
            }
        }

        case 'load-projects-mobile': {
            return {
                ...userData,
                activeSite: false,
                activeGroup: false,
                activeChat: false,
                activeWindow: 'sites',
                activeMenu: false
            }
        }

        case 'load-chats-mobile': {
            return {
                ...userData,
                activeSite: false,
                activeGroup: false,
                activeChat: false,
                activeMenu: false,
                activeWindow: 'chats',
            }
        }

        case 'load-members-mobile': {
            return {
                ...userData,
                // activeSite: false,
                // activeGroup: false,
                // activeChat: false,
                activeMenu: false,
                activeWindow: 'members',
            }
        }

        case 'load-profile': {
            return {
                ...userData,
                activeSite: false,
                activeGroup: false,
                activeChat: false,
                activeMenu: 'profile'
            }
        }

        case 'load-site': { // load selected site data
            let activeSite = action.payload.site
            let activeGroup = Object.keys(userData.sites[activeSite].groups)[0]
            return {
                ...userData,
                activeSite,
                activeGroup,
                activeChat: false,
                details: null,
                activeWindow: 'groups',
                activeMenu: false
            }
        }

        case 'load-group': { // load selected group data
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
                activeWindow: 'messages',
                activeChat: false,
                activeMenu: false
            }
        }

        case 'load-chat': { // load selected chat data
            const { chat } = action.payload
            return {
                ...userData,
                chats: {
                    ...userData.chats,
                    [chat]: {
                        ...userData.chats[chat],
                        unread: false
                    }
                },
                activeSite: false,
                activeGroup: false,
                activeChat: chat,
                activeWindow: 'messages',
                details: { id: chat, isShown: false },
                activeMenu: false
            }
        }

        case 'open-chat': {
            const { id, chat } = action.payload
            return {
                ...userData,
                chats: {
                    ...userData.chats,
                    [id]: {
                        ...chat,
                        unread: false
                    }
                },
                activeSite: false,
                activeGroup: false,
                activeChat: id,
                activeWindow: 'messages',
                details: { id: id, isShown: false },
                activeMenu: false
            }
        }

        case 'close-chat': { // find better solution
            const { chat } = action.payload
            const { [chat]: _, ...chats } = userData.chats
            return {
                ...userData,
                chats,
                activeSite: false,
                activeGroup: false,
                activeChat: false,
                activeMenu: 'projects',
                details: null
            }
        }

        case 'create-group': { // create group
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
                ...(activeConnection) && { activeChat: false },
                ...(activeConnection) && { activeMenu: false }
            }
        }

        case 'create-site': { // create site and join general group
            let { siteData, activeConnection } = action.payload
            let activeSite = Object.keys(siteData)[0]
            let activeGroup = Object.keys(siteData[activeSite].groups)[0]
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    ...siteData
                },
                ...(activeConnection) && {
                    activeSite,
                    activeGroup,
                    activeMenu: 'settings'
                }
            }
        }

        case 'group-chat-message': {
            let timestamp = new Date().toUTCString()
            let { src, site, group, msg, type } = action.payload
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
                                    { src, msg, type, timestamp }
                                ],
                                unread: group !== userData.activeGroup && src !== userData.personal._id
                            }
                        }
                    }
                }
            }
        }

        case 'single-chat-message': {
            let timestamp = new Date().toUTCString()
            let { src, chat, msg, type } = action.payload
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
                                    { src, msg, type, timestamp }
                                ],
                                unread: chat !== userData.activeChat && src !== userData.personal._id
                            }
                            : {
                                messages: [{ src, msg, type, timestamp }],
                                unread: true
                            }
                    }
                }
            }
        }

        case 'online-message': {
            let { user } = action.payload
            return {
                ...userData,
                sites: addNotice(user, 'online'),
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user._id]: {
                        ...userData.associatedUsers[user._id],
                        online: true
                    }
                }
            }
        }

        case 'join-message': {
            let timestamp = new Date().toUTCString()
            let { user, site, group } = action.payload
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
                                        notice: true,
                                        event: 'joined',
                                        msg: `${user.name} has joined.`,
                                        timestamp
                                    }
                                ],
                            }
                        }
                    }
                },
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user._id]: {
                        username: user.username,
                        name: user.name,
                        picture: user.picture,
                        online: user.online
                    }
                }
            }
        }

        case 'quit-message': {
            let { user } = action.payload
            return {
                ...userData,
                sites: addNotice(user, 'offline'),
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user._id]: {
                        ...userData.associatedUsers[user._id],
                        online: false
                    }
                }
            }
        }

        case 'add-user-to-site-invitations': {
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
                        picture: user.picture,
                        online: user.online
                    }
                }
            }
        }

        case 'remove-user-from-site-invitations': {
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


        case 'remove-user-from-site-requests': {
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


        case 'request-accepted': {
            let { site, associatedUsers } = action.payload
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    ...site
                },
                requests: userData.requests.filter(r => r._id !== Object.keys(site)[0]),
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

        case 'add-site-to-invitations': {
            return {
                ...userData,
                invitations: [
                    ...userData.invitations || [],
                    action.payload.siteData
                ]
            }
        }

        case 'add-site-to-requests': {
            return {
                ...userData,
                requests: [
                    ...userData.requests || [],
                    action.payload.siteData
                ]
            }
        }

        case 'remove-site-from-requests': {
            return {
                ...userData,
                requests: userData.requests.filter(r => r._id !== action.payload.site)
            }
        }

        case 'remove-site-from-invitations': {
            return {
                ...userData,
                invitations: userData.invitations.filter(i => i._id !== action.payload.site)
            }
        }

        case 'add-user-to-site-requests': {
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
                        picture: user.picture,
                        online: user.online
                    }
                }
            }
        }


        case 'invitation-accepted': {
            let { siteData, associatedUsers, activeConnection } = action.payload
            let activeSite = Object.keys(siteData)[0]
            let activeGroup = Object.keys(siteData[activeSite].groups)[0]
            return {
                ...userData,
                sites: {
                    ...userData.sites,
                    ...siteData
                },
                invitations: userData.invitations.filter(i => i._id !== Object.keys(siteData)[0]) || [],
                associatedUsers: {
                    ...userData.associatedUsers,
                    ...associatedUsers
                },
                ...(activeConnection) && { activeSite },
                ...(activeConnection) && { activeGroup },
                ...(activeConnection) && { activeChat: false }
            }
        }

        case 'update-profile-data': {
            const { newData } = action.payload
            return {
                ...userData,
                personal: {
                    ...userData.personal,
                    ...newData
                },
                associatedUsers: {
                    ...userData.associatedUsers,
                    [userData.personal._id]: {
                        ...userData.associatedUsers[userData.personal._id],
                        ...newData
                    }
                }
            }
        }

        case 'profile-update': {
            const { user } = action.payload
            return {
                ...userData,
                associatedUsers: {
                    ...userData.associatedUsers,
                    [user._id]: {
                        ...userData.associatedUsers[user._id],
                        ...user.data,
                    }
                }
            }
        }

        case 'show-info': {
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

        case 'show-details': {
            return {
                ...userData,
                activeWindow: 'details',
                details: { id: action.id, isShown: action.show }
            }
        }

        case 'toggle-details': {
            const currentDetails = userData.details
            return {
                ...userData,
                details: { ...currentDetails, isShown: !currentDetails.isShown }
            }
        }

        case 'clear-details': {
            return { ...userData, details: null }
        }

        case 'disconnect-message': {
            return false
        }

        // case 'reconnect-attempt-message':
        //     break

        // case 'reconnect-error-message':
        //     break

        // case 'reconnect-failed-message':
        //     break

        // case 'reconnect-message':
        //     break

        default:
            return userData
    }

    function addNotice(member, event) {
        let timestamp = new Date().toUTCString()
        for (const site in userData.sites) {
            for (const group in userData.sites[site].groups) {
                if (userData.sites[site].groups[group].members.includes(member._id)) {
                    userData.sites[site].groups[group].messages.push({
                        notice: true,
                        event,
                        msg: `${member.name} is ${event}`,
                        timestamp
                    })
                }
            }
        }
        return userData.sites
    }

    function setDevice() {
        if (window.screen.width < 480) return 'mobile'
        else if (window.screen.width < 1024) return 'tablet'
        else return 'desktop'
    }
}