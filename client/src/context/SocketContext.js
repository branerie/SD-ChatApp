import React , {useRef, useEffect, useContext, useState} from 'react'
import { MessagesContext } from './MessagesContext'
import io from "socket.io-client"
import { useLocation } from "react-router-dom"
let socket;

export const SocketContext = React.createContext()

export const SocketContextProvider = (props) => {
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
            context.setGroups(["STATUS", ...groups])
            context.setChats(chats)
            groups.forEach(group => {
                context.updateMessages({
                    user: "SYSTEM",
                    msg: `You are now talking in ${group}`,
                    group
                })
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
        })
    
        socket.on('quit-message', ({ user, reason, group }) => {
            context.updateMessages({ user: "SERVER", msg: `${user} has quit (${reason})`, group })
        })

        return () => socket.disconnect()
    }, [])

    return (
        <SocketContext.Provider value={{socket, username}}>
            {props.children}
        </SocketContext.Provider>
    )
}