import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatProjectsList from '../ChatProjectsList'
import ChatProjectsPendingList from '../ChatProjectsPendingList'
import ChatsPrivateList from '../ChatsPrivateList'


const ChatProjectsSideBar = () => {
    const context = useContext(MessagesContext)
 
    return (
        <aside className="chat-sidebar">
            {!context.userData && <div>Loading projects...</div>}
            <ChatProjectsList />
            {((context.userData.invitations && context.userData.invitations.length > 0) || 
            (context.userData.requests && context.userData.requests.length > 0)) &&
            <ChatProjectsPendingList />}
            <ChatsPrivateList />
        </aside>
    )
}

export default ChatProjectsSideBar
