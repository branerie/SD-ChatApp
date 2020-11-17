import React , {useRef, useEffect, useContext, useState} from 'react'
import { MessagesContext } from './MessagesContext'
import io from "socket.io-client"
import { useLocation } from "react-router-dom"
let socket;

export const SocketContext = React.createContext()

export function SocketContextProvider(props) {
    // const [socket, setSocket] = useState()
    // const socket = useRef()
    const context = useContext(MessagesContext)
    const location = useLocation()
    const username = location.username

    useEffect(() => {

        socket = io("http://localhost:5000", {
            query: { username },
            transports: ['websocket']
        })

        socket.on("connect", () => {
            document.title = username
        })
    
        socket.on('welcome-message', ({ user, msg, groups, chats }) => {
            context.updateMessages({ user, msg, group: "STATUS" })
            context.setGroups(["STATUS", ...Object.keys(groups)])
            context.setChats(chats)
            context.dispatch({type: 'loadUsers', payload: { groups }})
            Object.keys(groups).forEach(group => {
                context.updateMessages({
                    user: "SYSTEM",
                    msg: `You are now talking in ${group}`,
                    group
                })
                // context.setUsers
            })
        })
    
        socket.on('chat-message', ({ user, msg, group }) => {
            context.updateMessages({ user, msg, group })
        })
    
        socket.on('join-message', ({ user, group }) => {
            context.updateMessages({
                user: "SERVER",
                msg: `${user} has joined ${group}`,
                group
            })
            context.dispatch({type: 'addUser', payload: { user, group }})
        })
    
        socket.on('quit-message', ({ user, reason, group }) => {
            context.updateMessages({ user: "SERVER", msg: `${user} has quit (${reason})`, group })
            context.dispatch({type: 'remUser', payload: { user, group }})
        })

        return () => socket.disconnect()
    }, [])

    return (
        <SocketContext.Provider value={{socket, username}}>
            {props.children}
        </SocketContext.Provider>
    )
}