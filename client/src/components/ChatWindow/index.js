import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatWindow = () => {
    const { messages, activeWindow } = useContext(MessagesContext)
    const { username } = useContext(SocketContext)

    return (
        <div className="chat-messages">
            {messages[activeWindow] && messages[activeWindow].map(({ user, msg, time }, i) => {
                return (
                    <div className="message" key={i}>
                        <p className={user === username ? 'text-self' : `text-${user}`}>
                            <span className="timestamp">{`[${time}] ${user}: `}</span>
                            {msg}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

export default ChatWindow
