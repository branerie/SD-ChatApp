import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'

const ChatGroupMembers = () => {
    const { users , activeWindow }  = useContext(MessagesContext)

    // function handleClick() {
    //     
    // }

    return (
        <aside className="chat-sidebar">
            <h2>ONLINE</h2>
            <ul>
                {users[activeWindow] && users[activeWindow].online.map((user, i) => {
                    return <li 
                    key={`onUser${i}`} 
                    // onClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
            <h2>OFFLINE</h2>
            <ul>
                {users[activeWindow] && users[activeWindow].offline.map((user, i) => {
                    return <li 
                    key={`offUser${i}`} 
                    // onClick={() => handleClick()}
                    >{user}</li>
                })}
            </ul>
        </aside>
    )
}

export default ChatGroupMembers