import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'

const ChatGroupMembers = () => {
    const { windowIsGroup, groupMembers, activeWindow, changeWindow, updateChats }  = useContext(MessagesContext)

    function handleClick(user) {
        updateChats(user)
        changeWindow(user, false)
    }

    if (!windowIsGroup) return null
    return (
        <aside className="chat-sidebar">
            <h2>ONLINE</h2>
            <ul>
                {groupMembers[activeWindow] && groupMembers[activeWindow].online.map((user, i) => {
                    return <li 
                    key={`onUser${i}`} 
                    onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
            <h2>OFFLINE</h2>
            <ul>
                {groupMembers[activeWindow] && groupMembers[activeWindow].offline.map((user, i) => {
                    return <li 
                    key={`offUser${i}`} 
                    onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
        </aside>
    )
}

export default ChatGroupMembers