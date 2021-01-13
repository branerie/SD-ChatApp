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
            dispatchUserData({ type: "welcome-message", payload: { userData }})
        })
        return () => socket.off('welcome-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('group-chat-message', ({ user, msg, group, site }) => {
            dispatchUserData({type: 'group-chat-message', payload: { user, msg, site, group }})
            // updateNewMessages(group, group !== activeWindow)
        })
        return () => socket.off('group-chat-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('single-chat-message', ({ user, msg }) => {
            dispatchUserData({type: 'single-chat-message', payload: { user: user.username, msg, group: user._id }})
            // updateNewMessages(user, user !== activeWindow)
        })
        return () => socket.off('single-chat-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('invite-message', siteData => {
            dispatchUserData({type: 'invite-message', payload: { siteData }})
        })
        return () => socket.off('invite-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('request-message', ({ site, username, _id }) => {
            dispatchUserData({type: 'request-message', payload: { site, username, _id }})
        })
        return () => socket.off('request-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('request-accepted', ({ site, onlineMembers }) => {
            dispatchUserData({type: 'request-accepted', payload: { site, onlineMembers }})
        })
        return () => socket.off('request-accepted')
    }, [socket])

    
    useEffect(() => {
        if (!socket) return
        socket.on('join-message', ({ user, online, site, group }) => {
            dispatchUserData({type: 'join-message', payload: { user, online, site, group }})
        })
        return () => socket.off('join-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('online-message', ({ user, site, group }) => {
            dispatchUserData({type: 'online-message', payload: { user, site, group }})
        })
        return () => socket.off('online-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('quit-message', ({ user, site, group, reason }) => {
            dispatchUserData({type: 'quit-message', payload: { user, site, group, reason }})
        })
        return () => socket.off('quit-message')
    }, [socket])


    useEffect(() => {
        if (!socket) return
        socket.on('disconnect', (reason) => {
            dispatchUserData({ type: "disconnect-message"})
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