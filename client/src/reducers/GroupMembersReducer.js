export default function GroupMembersReducer(groupMembers, action) {
    const { group, user } = action.payload
    switch (action.type) {
        case "loadUsers":
            console.log(action.payload.groups);
            return action.payload.groups
        case "unloadUsers":
            return {}
        case "addUser":
            return {
                ...groupMembers,
                [group]: {
                    online: [...groupMembers[group].online, user],
                    offline: groupMembers[group].offline.filter(member => member !== user)
                }
            }
        case "remUser":
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