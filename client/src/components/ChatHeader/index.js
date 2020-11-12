import React from 'react'
import './index.css'

const ChatHeader = ({ title }) => {
    return (
        <header className="chat-header">
            <h1>SmartChat / {title}</h1>
            <a href="/login" className="btn">Exit</a>
        </header>
    )
}

export default ChatHeader
