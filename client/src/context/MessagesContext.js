/*
    System (on disconnect, reconnecting and reconnect)
    message {
        user: SERVER, SYSTEM or Client
        msg: Based on event
        group: status, group or chat
    }
    
    Messages State for UX
    messagesPool {
        status: [ {msg}, {msg}, ... ],
        group1: [ {msg}, {msg}, ... ],
        group2: [ {msg}, {msg}, ... ],
      }
*/
import React, { useState, useReducer, useContext, useEffect, useCallback } from 'react'
import { SocketContext } from "./SocketContext"
import GroupMembersReducer from "../reducers/GroupMembersReducer"
import MessagesReducer from "../reducers/MessagesReducer"

export const MessagesContext = React.createContext()

export default function MessagesContextProvider(props) {

    const { socket, ME } = useContext(SocketContext)
    console.log("Rerender counter")

    const [groupMembers, dispatchGroupMembers] = useReducer(GroupMembersReducer, {})
    const [messages, dispatchMessages] = useReducer(MessagesReducer, { "STATUS": [] })
    const [newMessages, setNewMessages] = useState({ "STATUS": false })
    const [groups, setGroups] = useState(["STATUS"])
    const [chats, setChats] = useState([])
    const [activeWindow, setActiveWindow] = useState("STATUS")
    const [windowIsGroup, setwindowIsGroup] = useState(false)

    function changeWindow(selectedWindow, isGroup) {
        setActiveWindow(selectedWindow)
        setwindowIsGroup(isGroup)
        updateNewMessages(selectedWindow, false)
    }
    

    const updateChats = useCallback((user, action) => {
        if (action === "open") {
            !chats.includes(user) && setChats(prevChats => [...prevChats, user])
        } else { // action == 'close'
            setChats(prevChats => prevChats.filter(chat => chat !== user))
        }
    }, [chats])

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
            document.title = ME
            dispatchMessages({ type: "connect-message" })
        })
        return () => socket.off('connect')
    }, [socket, ME, dispatchMessages])


    useEffect(() => {
        if (!socket) return
        socket.on('welcome-message', ({ groups, chats }) => {
            setGroups(["STATUS", ...Object.keys(groups)])
            setChats(chats)
            dispatchGroupMembers({ type: 'loadUsers', payload: { groups } })
            dispatchMessages({ type: "welcome-message", payload: { groups: Object.keys(groups), user: ME } })
        })
        return () => socket.off('welcome-message')
    }, [socket, ME, setGroups, setChats, dispatchGroupMembers, dispatchMessages])


    useEffect(() => {
        if (!socket) return
        socket.on('group-chat-message', ({ user, msg, group }) => {
            updateNewMessages(group, group !== activeWindow)
            dispatchMessages({ type: "chat-message", payload: { user, msg, group } })
        })
        return () => socket.off('group-chat-message')
    }, [socket, activeWindow, updateNewMessages, dispatchMessages])


    useEffect(() => {
        if (!socket) return
        socket.on('single-chat-message', ({ user, msg }) => {
            updateChats(user, "open")
            updateNewMessages(user, user !== activeWindow)
            dispatchMessages({ type: "chat-message", payload: { user, msg, group: user } })
        })
        return () => socket.off('single-chat-message')
    }, [socket, activeWindow, updateNewMessages, updateChats, dispatchMessages])


    useEffect(() => {
        if (!socket) return
        socket.on('join-message', ({ user, group }) => {
            dispatchMessages({ type: "join-message", payload: { user, group } })
            dispatchGroupMembers({ type: 'addUser', payload: { user, group } })
        })
        return () => socket.off('join-message')
    }, [socket, dispatchMessages, dispatchGroupMembers])


    useEffect(() => {
        if (!socket) return
        socket.on('quit-message', ({ user, reason, group }) => {
            dispatchMessages({ type: "quit-message", payload: { user, reason, group } })
            dispatchGroupMembers({ type: 'remUser', payload: { user, group } })
        })
        return () => socket.off('quit-message')
    }, [socket, dispatchMessages, dispatchGroupMembers])


    useEffect(() => {
        if (!socket) return
        socket.on('disconnect', (reason) => {
            dispatchMessages({ type: "disconnect-message", payload: { reason, groups: [...new Set(["STATUS", activeWindow])] } })
            dispatchGroupMembers({ type: 'unloadUsers', payload: {} })
        })
        return () => socket.off('disconnect')
    }, [socket, activeWindow, dispatchMessages, dispatchGroupMembers])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_attempt', (attemptNumber) => {
            dispatchMessages({ type: "reconnect-attempt-message", payload: { attemptNumber } })
        })
        return () => socket.off('reconnect_attempt')
    }, [socket, dispatchMessages])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_error', (error) => {
            dispatchMessages({ type: "reconnect-error-message", payload: { error } })
        })
        return () => socket.off('reconnect_error')
    }, [socket, dispatchMessages])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_failed', () => {
            dispatchMessages({ type: "reconnect-failed-message" })
        })
        return () => socket.off('reconnect_failed')
    }, [socket, dispatchMessages])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect', (attemptNumber) => {
            dispatchMessages({ type: "reconnect-message", payload: { attemptNumber } })
            socket.off('connect')
        })
        return () => socket.off('reconnect')
    }, [socket, dispatchMessages])


    return (
        <MessagesContext.Provider value={{
            groups, setGroups,
            groupMembers, dispatchGroupMembers,
            messages, dispatchMessages,
            newMessages, updateNewMessages,
            chats, setChats, updateChats,
            activeWindow, changeWindow,
            windowIsGroup
        }}>
            {props.children}
        </MessagesContext.Provider>
    )
}