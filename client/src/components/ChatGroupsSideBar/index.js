import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatGroupsList from '../ChatGroupsList'
import ChatGroupMembers from '../ChatGroupMembers'
import ChatProjectPendingMembers from '../ChatProjectPendingMembers'

const ChatGroupsSideBar = () => {
    const { userData } = useContext(MessagesContext)

    if (!userData) {
        return (
            <aside className="chat-sidebar" >
                <div>Loading groups...</div>
            </aside >
        )
    } else if (!userData.activeSite) {
        return null
    } else {
        return (
            <aside className="chat-sidebar">
                <ChatGroupsList />
                <ChatGroupMembers />
                {((userData.sites[userData.activeSite].invitations && userData.sites[userData.activeSite].invitations.length > 0) ||
                    (userData.sites[userData.activeSite].requests && userData.sites[userData.activeSite].requests.length > 0)) &&
                    <ChatProjectPendingMembers />}
            </aside>
        )
    }
}

export default ChatGroupsSideBar