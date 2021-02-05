import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatMessageInput = () => {
    const [msg, setMsg] = useState('')
    const { userData, dispatchUserData} = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const messageRef = useRef()

    function sendMessage(e) {
        e.preventDefault()

        let recipientType, recipient, site
        if (userData.activeChat) {
            recipientType = 'single-chat-message'
            recipient = userData.activeChat
            site = null
        } else {
            recipientType = 'group-chat-message'
            recipient = userData.activeGroup
            site = userData.activeSite
        }

        socket.emit(recipientType, { site, recipient, msg }, () => {
            setMsg('')
            if (recipient === userData.personal._id) return
            dispatchUserData({
                type: recipientType, 
                payload: { 
                    user: userData.personal._id, 
                    msg, 
                    site, 
                    group: recipient, 
                    chat: recipient,
                    own: true
                }
            })
        })
        return
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