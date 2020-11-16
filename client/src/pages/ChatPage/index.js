import React, { useContext } from 'react'
import "./index.css"
import ChatList from "../../components/ChatList"
import ChatHeader from '../../components/ChatHeader'
import ChatWindow from '../../components/ChatWindow'
import ChatMessageInput from '../../components/ChatMessageInput'
import ChatGroupMembers from '../../components/ChatGroupMembers'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContextProvider } from '../../context/SocketContext'

const ChatPage = () => {
    const { windowIsGroup } = useContext(MessagesContext)

    return (
        <SocketContextProvider>
            <div className="chat-container">
                <ChatHeader />
                <main className="chat-main">
                    <ChatList />
                    <ChatWindow />
                    {windowIsGroup && <ChatGroupMembers />}
                </main>
                <ChatMessageInput />
            </div>
        </SocketContextProvider>
    )
}

export default ChatPage
