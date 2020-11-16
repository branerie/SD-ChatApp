import React, { useEffect, useContext, useState, useRef, useCallback } from 'react'
import { useLocation } from "react-router-dom"
import ChatList from "../../components/ChatList"
import io from "socket.io-client"
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatHeader from '../../components/ChatHeader'
import ChatWindow from '../../components/ChatWindow'
import ChatMessageInput from '../../components/ChatMessageInput'
import ChatGroupMembers from '../../components/ChatGroupMembers'

// let socket;

const ChatPage = () => {
    const context = useContext(MessagesContext)
    console.log(context);
    const location = useLocation()
    const username = location.username

    const socket = useRef()

    useEffect(() => {

        socket.current = io("http://localhost:5000", {
            query: { username: location.username },
            transports: ['websocket']
        })

        socket.current.on("connect", () => {
            document.title = username
        })

        socket.current.on('welcome-message', ({ user, msg, groups, chats }) => {
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

        socket.current.on('chat-message', ({ user, msg, group }) => {
            context.updateMessages({ user, msg, group })
        })

        socket.current.on('join-message', ({ user, group }) => {
            context.updateMessages({
                user: "SERVER",
                msg: `${user} has joined ${group}`,
                group
            })
        })

        socket.current.on('quit-message', ({ user, reason, group }) => {
            context.updateMessages({ user: "SERVER", msg: `${user} has quit (${reason})`, group })
        })

        return () => socket.current.disconnect()
    }, [])

    return (
        <div className="chat-container">
            <ChatHeader />
            <main className="chat-main">
                <ChatList />
                <ChatWindow user={username} />
                {context.windowIsGroup && <ChatGroupMembers />}
            </main>
            <ChatMessageInput socket={socket.current} user={username} />
        </div>
    )
}

export default ChatPage
