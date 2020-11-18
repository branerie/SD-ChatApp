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

export const MessagesContext = React.createContext()

function reducer(groupMembers, action) {
    const { group, user } = action.payload
    switch (action.type) {
        case "loadUsers":
            return action.payload.groups
        case "addUser":
            groupMembers[group].online.push(user)
            groupMembers[group].offline = groupMembers[group].offline.filter(member => member !== user)
            return groupMembers
        case "remUser":
            groupMembers[group].offline.push(user)
            groupMembers[group].online = groupMembers[group].online.filter(member => member !== user)
            return groupMembers
        default:
            return groupMembers
    }
}

export default function MessagesContextProvider(props) {

    const { socket } = useContext(SocketContext)
    console.log(socket);

    const [groupMembers, dispatch] = useReducer(reducer, {})
    // const [users, setUsers] = useState()
    const [groups, setGroups] = useState(["STATUS"])
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState({ "STATUS": [] })
    const [activeWindow, setActiveWindow] = useState("STATUS")
    const [windowIsGroup, setwindowIsGroup] = useState(false)

    function updateGroups(groups) {
        setGroups(prevGroups => ([...prevGroups, ...groups]))
    }

    const updateMessages = useCallback(({ user, msg, group }) => {
        setMessages(prevMessages => ({
            ...prevMessages,
            [group]: [
                ...prevMessages[group] || [],
                { user, msg, time: new Date().toLocaleTimeString() }
            ]
        }))
    }, [setMessages])

    function changeWindow(selectedWindow, isGroup) {
        setActiveWindow(selectedWindow)
        setwindowIsGroup(isGroup)
    }


    // EVENTS SECTION
    useEffect(() => {
        if (!socket) return
        socket.on('welcome-message', ({ user, msg, groups, chats }) => {
            updateMessages({ user, msg, group: "STATUS" })
            setGroups(["STATUS", ...Object.keys(groups)])
            setChats(chats)
            dispatch({ type: 'loadUsers', payload: { groups } })
            Object.keys(groups).forEach(group => {
                updateMessages({
                    user: "SYSTEM",
                    msg: `You are now talking in ${group}`,
                    group
                })
            })
        })
        return () => socket.off('welcome-message')
    }, [socket, updateMessages])

    useEffect(() => {
        if (!socket) return
        socket.on('chat-message', ({ user, msg, group }) => {
            updateMessages({ user, msg, group })
        })
        return () => socket.off('chat-message')
    }, [socket, updateMessages])

    useEffect(() => {
        if (!socket) return
        socket.on('join-message', ({ user, group }) => {
            updateMessages({
                user: "SERVER",
                msg: `${user} has joined ${group}`,
                group
            })
            dispatch({ type: 'addUser', payload: { user, group } })
        })
        return () => socket.off('join-message')
    }, [socket, updateMessages])

    useEffect(() => {
        if (!socket) return
        socket.on('quit-message', ({ user, reason, group }) => {
            updateMessages({ user: "SERVER", msg: `${user} has quit (${reason})`, group })
            dispatch({ type: 'remUser', payload: { user, group } })
        })
        return () => socket.off('quit-message')
    }, [socket, updateMessages])


    useEffect(() => {
        if (!socket) return
        socket.on('disconnect', (reason) => {
            updateMessages({
                user: "SYSTEM",
                msg: `You have been disconnected from server (${reason}):`,
                group: "STATUS"
            })
            // dispatch({ type: 'remUser', payload: { user, group } })
        })
        return () => socket.off('disconnect')
    }, [socket, updateMessages])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_attempt', (attemptNumber) => {
            updateMessages({
                user: "SYSTEM",
                msg: `Attempt to connect to server (${attemptNumber}):`,
                group: "STATUS"
            })
            // dispatch({ type: 'remUser', payload: { user, group } })
        })
        return () => socket.off('reconnect_attempt')
    }, [socket, updateMessages])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_error', (error) => {
            updateMessages({
                user: "SYSTEM",
                msg: `Failed to connect to server (${error}):`,
                group: "STATUS"
            })
            // dispatch({ type: 'remUser', payload: { user, group } })
        })
        return () => socket.off('reconnect_error')
    }, [socket, updateMessages])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect_failed', () => {
            updateMessages({
                user: "SYSTEM",
                msg: "Maximum number of retries reached." ,
                group: "STATUS"
            })
            // dispatch({ type: 'remUser', payload: { user, group } })
        })
        return () => socket.off('reconnect_failed')
    }, [socket, updateMessages])


    useEffect(() => {
        if (!socket) return
        socket.io.on('reconnect', (attemptNumber) => {
            updateMessages({
                user: "SYSTEM",
                msg: `Reconnected to server after ${attemptNumber} retries!`,
                group: "STATUS"
            })
            // dispatch({ type: 'remUser', payload: { user, group } })
        })
        return () => socket.off('reconnect')
    }, [socket, updateMessages])

    return (
        <MessagesContext.Provider value={{
            groups, setGroups, updateGroups,
            groupMembers, dispatch,
            chats, setChats,
            messages, updateMessages,
            activeWindow, changeWindow,
            windowIsGroup
        }}>
            {props.children}
        </MessagesContext.Provider>
    )
}