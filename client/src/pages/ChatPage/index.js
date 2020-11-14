import React, { useEffect, useContext, useState, useRef } from 'react'
import { useLocation } from "react-router-dom"
import ChatList from "../../components/ChatList"
import io from "socket.io-client"
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatHeader from '../../components/ChatHeader'
import ChatWindow from '../../components/ChatWindow'
import ChatMessageInput from '../../components/ChatMessageInput'

// let socket;

const ChatPage = () => {
    const context = useContext(MessagesContext)
    console.log(context);
    const location = useLocation()
    const username = location.username
    const [socketID, setSocketID] = useState(null)
    const confs = ['conf', 'conf2', 'conf3'] //dummy 
    const chats = ['user1', 'user2', 'user3'] //dummy

    const socket = useRef()

    useEffect(() => {

        socket.current = io("http://localhost:5000", {
            query: { username: location.username },
            transports: ['websocket']
        })

        socket.current.on("connect", () => {
            // setSocketID(socket.id)
            // console.log([socketID, username]);
            document.title = username
        })
        
        socket.current.on('welcome-message', ({ user, msg, groups }) => {
            context.updateMessages({ user, msg, group: "STATUS" })
            context.updateGroups(groups)
        })

        socket.current.on('chat-message', ({ user, msg, group }) => {
            context.updateMessages({ user, msg, group })
        })
        
        socket.current.on('join-message', ({ user, group }) => {
            context.updateMessages({
                user: "SERVER",
                msg: user === username ? `You are now talking in ${group}` : `${user} has joined ${group}`,
                group 
            })     
        })

        socket.current.on('quit-message', ({ user, reason, group }) => {
            context.updateMessages({ user: "SERVER", msg: `${user} has quit (${reason})`, group })
        })
    }, [])

    return (
        // <MessagesContextProvider>
            <div className="chat-container">
                <ChatHeader />
                <main className="chat-main">
                    <aside className="chat-sidebar">
                        {/* <ul><li key="status-window" className="selected">STATUS</li></ul> */}
                        {context.groups ? <ChatList label={"groups"} data={context.groups} /> : null}
                        {confs ? <ChatList label={"conferences"} data={confs} /> : null}
                        {chats ? <ChatList label={"chats"} data={chats} /> : null}
                    </aside>
                    <div className="chat-messages-container">
                        <ChatWindow user={username}/>
                    </div>
                    <aside className="chat-sidebar chat-members hidden">
                        <h2>ONLINE</h2>
                        <ul id="members"></ul>
                    </aside>
                </main>
                <ChatMessageInput socket={socket.current} user={username}/>
            </div>
        // </MessagesContextProvider>
    )
}

export default ChatPage
