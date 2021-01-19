import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatMessageInput = () => {
    const [msg, setMsg] = useState('')
    const context = useContext(MessagesContext)
    const { socket, ME } = useContext(SocketContext)
    const messageRef = useRef()

    function sendMessage(e) {
        e.preventDefault()

        let recipientType, recipient, site
        if (context.userData.activeChat) {
            recipientType = 'single-chat-message'
            recipient = context.userData.activeChat
            site = null
        } else {
            recipientType = 'group-chat-message'
            recipient = context.userData.activeGroup
            site = context.userData.activeSite
        }

        socket.emit(recipientType, { site, recipient, msg }, () => attachMsg(recipientType, recipient, site))
        return
    }

    function attachMsg(recipientType, recipient, site) {
        context.dispatchUserData({type: recipientType, payload: { user: ME, msg, site, group: recipient, chat: recipient }})
        setMsg('')
    }

    useEffect(() => messageRef.current.focus())

    return (
        <div className="chat-form-container">
            <form onSubmit={e => sendMessage(e)}>
                <input ref={messageRef} type="text" autoFocus value={msg} required autoComplete="off" onChange={e => setMsg(e.target.value)} />
                <button className="btn">Send</button>
            </form>
        </div>
    )
}

export default ChatMessageInput