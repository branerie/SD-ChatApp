import React, { useContext, useRef, useEffect } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatWindow = () => {
    const context = useContext(MessagesContext)
    const { ME } = useContext(SocketContext)
    const messagesRef = useRef()

    useEffect(() => messagesRef.current.scrollTop = messagesRef.current.scrollHeight)
    
    if (!context.userData) return (
        <div className="chat-messages" ref={messagesRef}>Loading messages....</div>
    )

    let messages = []
    if (context.userData.activeChat) {
        messages = context.userData.chats[context.userData.activeChat].messages
    } else {
        messages = context.userData.sites[context.userData.activeSite].groups[context.userData.activeGroup].messages
    }

    return (
        <div className="chat-messages" ref={messagesRef}>
            {messages.map(({ user, msg, timestamp }, i) => {
                let classList = []
                if (user === ME ) classList.push('text-self')
                else if (user === 'SERVER') {
                    if (msg.endsWith('online.')) classList.push('text-server-online')
                    else if (msg.endsWith('offline.')) classList.push('text-server-offline')
                }
                return (
                    <div className="message" key={i}>
                        <p className={classList.join(" ")}>
                            <span className="timestamp">{`[${timestamp}] ${user}: `}</span>
                            {msg}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

export default ChatWindow
