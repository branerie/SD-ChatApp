import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { AuthenticateUser } from '../../context/authenticationContext'

const ChatHeader = () => {
    const { userData } = useContext(MessagesContext)
    const { logOut } = AuthenticateUser()

    if (!userData) return (
        <header className="chat-header">
            <h1>Loading data...</h1>
        </header>
    )

    const chat = userData.activeChat
    const site = userData.sites[userData.activeSite].name
    const group = userData.sites[userData.activeSite].groups[userData.activeGroup].name
    return (
        <header className="chat-header">
            <h1>SmartChat / {chat ? userData.chats[chat].username : `${site} / ${group}`}</h1>
            <a href="/login" className="btn" onClick={logOut}>Logout</a>
        </header>
    )
}

export default ChatHeader
