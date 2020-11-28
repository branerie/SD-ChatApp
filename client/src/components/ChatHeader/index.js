import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { AuthenticateUser } from '../../context/authenticationContext'

const ChatHeader = () => {
    const { activeWindow } = useContext(MessagesContext)
    const { logOut } = AuthenticateUser()
    return (
        <header className="chat-header">
            <h1>SmartChat / {activeWindow}</h1>
            <a href="/login" className="btn" onClick={logOut}>Logout</a>
        </header>
    )
}

export default ChatHeader
