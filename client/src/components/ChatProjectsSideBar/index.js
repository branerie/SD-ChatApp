import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatProjectsList from '../ChatProjectsList'
import ChatsPrivateList from '../ChatsPrivateList'


const ChatProjectsSideBar = () => {
    const context = useContext(MessagesContext)
 
    return (
        <aside className="chat-sidebar">
            {!context.userData && <div>Loading projects...</div>}
            <ChatProjectsList />
            <ChatsPrivateList />
        </aside>
    )
}

export default ChatProjectsSideBar
