import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'

const ChatHeader = () => {
    const { activeWindow } = useContext(MessagesContext)
    return (
        <header className="chat-header">
            <h1>SmartChat / {activeWindow}</h1>
            <a href="/login" className="btn">Exit</a>
        </header>
    )
}

export default ChatHeader
