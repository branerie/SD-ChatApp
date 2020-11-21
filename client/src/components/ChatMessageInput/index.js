import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatMessageInput = () => {
    const [message, setMessage] = useState('')
    const { windowIsGroup, activeWindow, dispatchMessages } = useContext(MessagesContext)
    const { socket, ME } = useContext(SocketContext)
    const messageRef = useRef()

    function sendMessage(e) {
        e.preventDefault()
        console.log(socket);

        socket.emit('chat-message', { recipient: activeWindow, msg: message , public: windowIsGroup }, () => attachMsg())
        return
    }

    function attachMsg() {
        dispatchMessages({ 
            type: "chat-message",
            payload: {
                user: ME,
                msg: message,
                group: activeWindow
            }
        })
        setMessage('')
    }

    useEffect(() => messageRef.current.focus())

    return (
        <div className="chat-form-container">
            <form onSubmit={e => sendMessage(e)}>
                <input ref={messageRef} type="text" autoFocus value={message} required autoComplete="off" onChange={e => setMessage(e.target.value)} />
                <button className="btn">Send</button>
            </form>
        </div>
    )
}

export default ChatMessageInput