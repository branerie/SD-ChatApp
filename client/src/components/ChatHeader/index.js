import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { AuthenticateUser } from '../../context/authenticationContext'
import {useHistory} from 'react-router-dom'

const ChatHeader = () => {
    const { userData } = useContext(MessagesContext)
    const { logOut } = AuthenticateUser()
    const history = useHistory()

    if (!userData) return (
        <header className="chat-header">
            <h1>Loading data...</h1>
        </header>
    )
    
    const chat = userData.activeChat
    const site = userData.activeSite ? userData.sites[userData.activeSite].name : false
    const group = site ? userData.sites[userData.activeSite].groups[userData.activeGroup].name : false
    return (
        <header className="chat-header">
            <h1>SmartChat / {chat ? userData.chats[chat].username : site ? `${site} / ${group}` : `Welcome ${userData.personal.username}`}</h1>
            <button onClick={
                () => {
                    history.push('/newchat')
                }

            }>NewChat</button>
            <a href="/" className="btn" onClick={()=>{logOut()}}>Logout</a>
        </header>
    )
}

export default ChatHeader
