import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'

const ChatGroupMembers = () => {
    const context = useContext(MessagesContext)

    function handleClick(user) {
        context.updateChats(user, "open")
        context.changeWindow(user, false)
    }

    return (
        <div>
            <h2>members: {context.groupMembers[context.activeWindow] && context.groupMembers[context.activeWindow].online.length + context.groupMembers[context.activeWindow].offline.length}</h2>
            <ul>
                {context.groupMembers[context.activeWindow] && context.groupMembers[context.activeWindow].online.map((user, i) => {
                    return <li
                        key={`onUser${i}`}
                        className="online"
                        onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
            <ul>
                {context.groupMembers[context.activeWindow] && context.groupMembers[context.activeWindow].offline.map((user, i) => {
                    return <li
                        key={`offUser${i}`}
                        className="offline"
                        onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
        </div>
    )
}

export default ChatGroupMembers