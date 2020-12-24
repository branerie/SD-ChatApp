import React , { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatGroupsList from '../ChatGroupsList'
import ChatGroupMembers from '../ChatGroupMembers'

const ChatGroupsSideBar = () => {
    const context = useContext(MessagesContext)
 
    return (
        <aside className="chat-sidebar">
            {!context.userData && <div>Loading groups...</div>}
            <ChatGroupsList />
            <ChatGroupMembers />
        </aside>
    )
}

export default ChatGroupsSideBar