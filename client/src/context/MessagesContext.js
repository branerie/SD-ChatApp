import React, { useState, useReducer, useContext, useEffect, useCallback } from 'react'
import { SocketContext } from "./SocketContext"
import UserDataReducer from "../reducers/UserDataReducer"

export const MessagesContext = React.createContext()

export default function MessagesContextProvider(props) {

    const { socket, ME } = useContext(SocketContext)
    // console.log("Rerender counter")

    const [userData, dispatchUserData] = useReducer(UserDataReducer, false)
    const [newMessages, setNewMessages] = useState({ "STATUS": false })

    const updateNewMessages = useCallback((chat, state) => {
        setNewMessages(prevMessages => ({
            ...prevMessages,
            [chat]: state
        }))
    }, [setNewMessages])

    // EVENTS SECTION
    useEffect(() => {
        if (!socket) return
        socket.on('connect', () => {
            document.title = `SmartChat | ${ME}`
            // dispatchMessages({ type: "connect-message" })
        })
        return () => socket.off('connect')
    }, [socket, ME])


    useEffect(() => {
        if (!socket) return
        socket.on('welcome-message', ({ userData }) => {
            dispatchUserData({ type: "welcome-message", payload: { userData } })
        })
        return () => socket.off('welcome-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('group-chat-message', ({ user, msg, group, site }) => {
            dispatchUserData({ type: 'group-chat-message', payload: { user, msg, site, group } })
            // updateNewMessages(group, group !== activeWindow)
        })
        return () => socket.off('group-chat-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('single-chat-message', ({ user, chat, msg }) => {
            dispatchUserData({ type: 'single-chat-message', payload: { user, chat, msg } })
            // updateNewMessages(user, user !== activeWindow)
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
        socket.on('invitation-accepted', ({ siteData, onlineMembers }) => {
            dispatchUserData({ type: 'invitation-accepted', payload: { siteData, onlineMembers } })
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
        socket.on('request-accepted', ({ site, onlineMembers }) => {
            dispatchUserData({ type: 'request-accepted', payload: { site, onlineMembers } })
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
        socket.on('join-message', ({ user, online, site, group }) => {
            dispatchUserData({ type: 'join-message', payload: { user, online, site, group } })
        })
        return () => socket.off('join-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('online-message', ({ user, site, group }) => {
            dispatchUserData({ type: 'online-message', payload: { user, site, group } })
        })
        return () => socket.off('online-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('quit-message', ({ user, site, group, reason }) => {
            dispatchUserData({ type: 'quit-message', payload: { user, site, group, reason } })
        })
        return () => socket.off('quit-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('disconnect', (reason) => {
            dispatchUserData({ type: "disconnect-message" })
            // dispatchMessages({ type: "disconnect-message", payload: { reason } })
        })
        return () => socket.off('disconnect')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_attempt', (attemptNumber) => {
            // dispatchMessages({ type: "reconnect-attempt-message", payload: { attemptNumber } })
        })
        return () => socket.off('reconnect_attempt')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_error', (error) => {
            // dispatchMessages({ type: "reconnect-error-message", payload: { error } })
        })
        return () => socket.off('reconnect_error')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_failed', () => {
            // dispatchMessages({ type: "reconnect-failed-message" })
        })
        return () => socket.off('reconnect_failed')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect', (attemptNumber) => {
            // dispatchMessages({ type: "reconnect-message", payload: { attemptNumber } })
            socket.off('connect')
        })
        return () => socket.off('reconnect')
    }, [socket])


    return (
        <MessagesContext.Provider value={{
            userData, dispatchUserData,
            newMessages, updateNewMessages
        }}>
            {props.children}
        </MessagesContext.Provider>
    )
}