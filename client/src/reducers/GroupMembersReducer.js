export default function GroupMembersReducer(groupMembers, action) {
    const { group, user } = action.payload
    switch (action.type) {
        case "load-users":
            return action.payload.groups
        case "load-new-group-users":
            return {
                ...groupMembers,
                [group._id]: { ...action.payload.data }
            }
        case "unload-users":
            return {}
        case "add-user":
            return {
                ...groupMembers,
                [group._id]: {
                    online: [...groupMembers[group._id].online, user],
                    offline: groupMembers[group._id].offline.filter(member => member !== user)
                }
            }
        case "remove-user":
            return {
                ...groupMembers,
                [group]: {
                    offline: [...groupMembers[group].offline, user],
                    online: groupMembers[group].online.filter(member => member !== user)
                }
            }
        default:
            return groupMembers
    }
}