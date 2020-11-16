import React, { useContext, useState } from 'react'
import { MessagesContext } from '../../context/MessagesContext'
import './index.css'

const ChatMessageInput = ({ socket, user }) => {
    const [message, setMessage] = useState('')
    const { activeWindow, updateMessages } = useContext(MessagesContext)

    function sendMessage(e) {
        e.preventDefault()
        console.log(socket);

        socket.emit('chat-message', { group: activeWindow, msg: message }, () => attachMsg())
    }

    function attachMsg() {
        updateMessages({
            group: activeWindow,
            msg: message,
            user: user
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