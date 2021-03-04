import React, { useReducer, useContext, useEffect } from 'react'
import { SocketContext } from "./SocketContext"
import UserDataReducer from "../reducers/UserDataReducer"

export const MessagesContext = React.createContext()

export default function MessagesContextProvider(props) {

    const { socket } = useContext(SocketContext)

    const [userData, dispatchUserData] = useReducer(UserDataReducer, false)

    useEffect(() => {
        if (!socket) return
        socket.on('connect', () => {
            document.title = `SmartChat | Loading...`
        })
        return () => socket.off('connect')
    }, [socket])
    
    
    useEffect(() => {
        if (!socket) return
        socket.on('welcome-message', ({ userData }) => {
            document.title = `SmartChat | ${userData.personal.username}`
            dispatchUserData({ type: "welcome-message", payload: { userData } })

        })
        return () => socket.off('welcome-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('group-chat-message', ({ src, msg, type, group, site }) => {
            dispatchUserData({ type: 'group-chat-message', payload: { src, msg, type, site, group } })
        })
        return () => socket.off('group-chat-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('single-chat-message', ({ src, chat, msg, type }) => {
            dispatchUserData({ type: 'single-chat-message', payload: { src, chat, msg, type } })
        })
        return () => socket.off('single-chat-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('create-site', siteData => {
            dispatchUserData({ type: 'create-site', payload: { siteData } })
        })
        return () => socket.off('create-site')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('create-group', ({ site, groupData }) => {
            dispatchUserData({ type: 'create-group', payload: { site, groupData } })
        })
        return () => socket.off('create-group')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('add-user-to-site-invitations', ({ site, user }) => {
            dispatchUserData({ type: 'add-user-to-site-invitations', payload: { site, user } })
        })
        return () => socket.off('add-user-to-site-invitations')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('add-site-to-invitations', siteData => {
            dispatchUserData({ type: 'add-site-to-invitations', payload: { siteData } })
        })
        return () => socket.off('add-site-to-invitations')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('invitation-accepted', ({ siteData, associatedUsers }) => {
            dispatchUserData({ type: 'invitation-accepted', payload: { siteData, associatedUsers } })
        })
        return () => socket.off('invitation-accepted')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('remove-site-from-invitations', site => {
            dispatchUserData({ type: 'remove-site-from-invitations', payload: { site } })
        })
        return () => socket.off('remove-site-from-invitations')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('remove-user-from-site-invitations', ({ user, site }) => {
            dispatchUserData({ type: 'remove-user-from-site-invitations', payload: { user, site } })
        })
        return () => socket.off('remove-user-from-site-invitations')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('remove-site-from-requests', site => {
            dispatchUserData({ type: 'remove-site-from-requests', payload: { site } })
        })
        return () => socket.off('remove-site-from-requests')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('remove-user-from-site-requests', ({ user, site }) => {
            dispatchUserData({ type: 'remove-user-from-site-requests', payload: { user, site } })
        })
        return () => socket.off('remove-user-from-site-requests')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('add-site-to-requests', siteData => {
            dispatchUserData({ type: 'add-site-to-requests', payload: { siteData } })
        })
        return () => socket.off('add-site-to-requests')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('add-user-to-site-requests', ({ site, user }) => {
            dispatchUserData({ type: 'add-user-to-site-requests', payload: { site, user } })
        })
        return () => socket.off('add-user-to-site-requests')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('request-accepted', ({ site, associatedUsers }) => {
            dispatchUserData({ type: 'request-accepted', payload: { site, associatedUsers } })
        })
        return () => socket.off('request-accepted')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('added-to-group', ({ site, group }) => {
            console.log(group);
            dispatchUserData({ type: 'added-to-group', payload: { site, group } })
        })
        return () => socket.off('added-to-group')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('join-message', ({ user, site, group }) => {
            dispatchUserData({ type: 'join-message', payload: { user, site, group } })
        })
        return () => socket.off('join-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('online-message', ({ user }) => {
            dispatchUserData({ type: 'online-message', payload: { user } })
        })
        return () => socket.off('online-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('quit-message', ({ user }) => {
            dispatchUserData({ type: 'quit-message', payload: { user } })
        })
        return () => socket.off('quit-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('update-profile-data', newData => {
            dispatchUserData({ type: 'update-profile-data', payload: { newData } })
        })
        return () => socket.off('update-profile-data')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('profile-update', ({ user }) => {
            dispatchUserData({ type: 'profile-update', payload: { user } })
        })
        return () => socket.off('profile-update')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('disconnect', (reason) => {
            dispatchUserData({ type: "disconnect-message" })
            // dispatchUserData({ type: "disconnect-message", payload: { reason } })
        })
        return () => socket.off('disconnect')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_attempt', (attemptNumber) => {
            // dispatchUserData({ type: "reconnect-attempt-message", payload: { attemptNumber } })
        })
        return () => socket.off('reconnect_attempt')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_error', (error) => {
            // dispatchUserData({ type: "reconnect-error-message", payload: { error } })
        })
        return () => socket.off('reconnect_error')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_failed', () => {
            // dispatchUserData({ type: "reconnect-failed-message" })
        })
        return () => socket.off('reconnect_failed')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect', (attemptNumber) => {
            // dispatchUserData({ type: "reconnect-message", payload: { attemptNumber } })
            socket.off('connect')
        })
        return () => socket.off('reconnect')
    }, [socket])

    function sendMessage(msg, msgType = 'plain') {
        let recipientType, recipient, site
        if (userData.activeChat) {
            recipientType = 'single-chat-message'
            recipient = userData.activeChat
            site = null
        } else {
            recipientType = 'group-chat-message'
            recipient = userData.activeGroup
            site = userData.activeSite
        }

        if (msgType !== 'image' && (msg.startsWith('http://') || msg.startsWith('https://'))) msgType = 'uri'
        socket.emit(recipientType, { site, recipient, msg, msgType }, () => {
            if (recipient === userData.personal._id) return

            dispatchUserData({
                type: recipientType,
                payload: {
                    src: userData.personal._id,
                    msg,
                    type: msgType,
                    site,
                    group: recipient,
                    chat: recipient
                }
            })
        })
        return
    }

    return (
        <MessagesContext.Provider value={{
            userData, dispatchUserData, sendMessage
        }}>
            {props.children}
        </MessagesContext.Provider>
    )
}