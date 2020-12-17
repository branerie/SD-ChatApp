export default function MessagesReducer(messages, action) {
    let newMessages = {}
    let timestamp = new Date().toLocaleTimeString()
    switch (action.type) {
        case "connect-message":
            newMessages["STATUS"] = [
                ...messages["STATUS"], {
                    user: "SYSTEM",
                    msg: "Connected to server",
                    timestamp
                }]
            break

        case "welcome-message":
            newMessages["STATUS"] = [
                ...messages["STATUS"], {
                    user: "SERVER",
                    msg: `Welcome ${action.payload.user}`,
                    timestamp
                }]
            Object.entries(action.payload.groups).forEach(([group, data]) => {
                newMessages[group] = [
                    ...messages[group] || data.messages, {
                        user: "SYSTEM",
                        msg: `You are now talking in ${data.name}`,
                        timestamp
                    }
                ]
            })
            Object.entries(action.payload.chats).forEach(([chat, data]) => {
                newMessages[chat] = [
                    ...messages[chat] || data.messages, {
                        user: "SYSTEM",
                        msg: `You are now talking with ${chat}`,
                        timestamp
                    }
                ]
            })
            break

        case "chat-message":
            newMessages[action.payload.group] = [
                ...messages[action.payload.group] || [], {
                    user: action.payload.user,
                    msg: action.payload.msg,
                    timestamp
                }
            ]
            break

        case "join-message":
            newMessages[action.payload.group._id] = [
                ...messages[action.payload.group._id], {
                    user: "SERVER",
                    msg: `${action.payload.user} has joined ${action.payload.group.name}`,
                    timestamp
                }
            ]
            break

        case "join-request-message":
            newMessages[action.payload.group._id] = [
                ...messages[action.payload.group._id] || [], {
                    user: "SYSTEM",
                    msg: `You are now talking in ${action.payload.group.name}`,
                    timestamp
                }
            ]
            break

        case "quit-message":
            newMessages[action.payload.group] = [
                ...messages[action.payload.group], {
                    user: "SERVER",
                    msg: `${action.payload.user} has quit (${action.payload.reason})`,
                    timestamp
                }
            ]
            break

        case "disconnect-message":
            action.payload.groups.forEach(group => {
                newMessages[group] = [
                    ...messages[group] || [], {
                        user: "SYSTEM",
                        msg: `You have been disconnected from server (${action.payload.reason}):`,
                        timestamp
                    }
                ]
            })
            break

        case "reconnect-attempt-message":
            newMessages["STATUS"] = [
                ...messages["STATUS"], {
                    user: "SYSTEM",
                    msg: `Attempt to connect to server (${action.payload.attemptNumber}):`,
                    timestamp
                }]
            break

        case "reconnect-error-message":
            newMessages["STATUS"] = [
                ...messages["STATUS"], {
                    user: "SYSTEM",
                    msg: `Failed to connect to server (${action.payload.error}):`,
                    timestamp
                }]
            break

        case "reconnect-failed-message":
            newMessages["STATUS"] = [
                ...messages["STATUS"], {
                    user: "SYSTEM",
                    msg: "Maximum number of retries reached...",
                    timestamp
                }]
            break

        case "reconnect-message":
            newMessages["STATUS"] = [
                ...messages["STATUS"], {
                    user: "SYSTEM",
                    msg: `Reconnected to server after ${action.payload.attemptNumber} retries!`,
                    timestamp
                }]
            break

        default:
            return messages
    }

    // console.log(newMessages)
    // console.log(messages)
    return {
        ...messages,
        ...newMessages
    }
}