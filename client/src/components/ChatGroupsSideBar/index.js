import React from 'react'
import "./index.css"
import ChatGroupsList from '../ChatGroupsList'
import ChatGroupMembers from '../ChatGroupMembers'

const ChatGroupsSideBar = () => {

    return (
        <aside className="chat-sidebar">
            <ChatGroupsList />
            <ChatGroupMembers />
        </aside>
    )
}

export default ChatGroupsSideBar