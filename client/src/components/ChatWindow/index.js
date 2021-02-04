import React, { useContext, useRef, useEffect } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'

const ChatWindow = () => {
    const context = useContext(MessagesContext)
    const messagesRef = useRef()

    useEffect(() => messagesRef.current.scrollTop = messagesRef.current.scrollHeight)
    
    if (!context.userData) return (
        <div className="chat-messages" ref={messagesRef}>Loading messages....</div>
    )

    let messages
    if (context.userData.activeChat) {
        messages = context.userData.chats[context.userData.activeChat].messages
    } else if (context.userData.activeSite) {
        messages = context.userData.sites[context.userData.activeSite].groups[context.userData.activeGroup].messages
    } else {
        messages = [{ 
            user: "SERVER", 
            msg: `Welcome to SmartChat Network ${context.userData.personal.username}.
            If you don't have any membership yet,
            you can create your own projects or join an existing project from the menu on the left.`, 
            timestamp: new Date().toLocaleTimeString()
        }]
    }

    return (
        <div className="chat-messages" ref={messagesRef}>
            {messages.map(({ user, msg, timestamp }, i) => {
                let classList = []
                if (user === context.userData.personal.username ) classList.push('text-self')
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
