import React from 'react'
import "./index.css"
import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import ChatHeader from '../../components/ChatHeader'
import ChatProjectsSideBar from "../../components/ChatProjectsSideBar"
import ChatGroupsSideBar from '../../components/ChatGroupsSideBar'
import ChatWindow from '../../components/ChatWindow'
import ChatMessageInput from '../../components/ChatMessageInput'

const ChatPage = () => {

    return (
        <SocketContextProvider>
            <MessagesContextProvider>
            <div className="chat-container">
                <ChatHeader />
                <main className="chat-main">
                    <ChatProjectsSideBar />
                    <ChatGroupsSideBar />
                    <ChatWindow />
                </main>
                <ChatMessageInput />
            </div>
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default ChatPage
