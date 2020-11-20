import React, { useContext, useState } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatMessageInput = () => {
    const [message, setMessage] = useState('')
    const { activeWindow, dispatchMessages } = useContext(MessagesContext)
    const { socket, ME } = useContext(SocketContext)

    function sendMessage(e) {
        e.preventDefault()
        console.log(socket);

        socket.emit('chat-message', { group: activeWindow, msg: message }, () => attachMsg())
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

    return (
        <div className="chat-form-container">
            <form onSubmit={e => sendMessage(e)}>
                <input type="text" value={message} required autoComplete="off" onChange={e => setMessage(e.target.value)} />
                <button className="btn">Send</button>
            </form>
        </div>
    )
}

export default ChatMessageInput