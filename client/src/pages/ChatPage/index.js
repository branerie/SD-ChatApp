import React from 'react'
import "./index.css"
import ChatList from "../../components/ChatList"
import ChatHeader from '../../components/ChatHeader'
import ChatWindow from '../../components/ChatWindow'
import ChatMessageInput from '../../components/ChatMessageInput'
import ChatGroupMembers from '../../components/ChatGroupMembers'
import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'

const ChatPage = () => {

    return (
        <SocketContextProvider>
            <MessagesContextProvider>
            <div className="chat-container">
                <ChatHeader />
                <main className="chat-main">
                    <ChatList />
                    <ChatGroupMembers />
                    <ChatWindow />
                </main>
                <ChatMessageInput />
            </div>
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default ChatPage
