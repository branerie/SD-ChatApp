import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'

const ChatWindow = (props) => {
    const { messages, activeWindow } = useContext(MessagesContext)
    return (
        <div className="chat-messages">
            {messages[activeWindow] && messages[activeWindow].map(({ user, msg, time }, i) => {
                return (
                    <div className="message" key={i}>
                        <p className={user === props.user ? 'text-self' : `text-${user}`}>
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
