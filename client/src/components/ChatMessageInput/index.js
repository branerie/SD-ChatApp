import React, { useState } from 'react'
import './index.css'

const ChatMessageInput = ({ socket }) => {
    const [message, setMessage] = useState('')
    const [group, setGroup] = useState("test")

    function sendMessage(e) {
        e.preventDefault()
        console.log(socket);

        socket.emit('chat-message', { message, group }, () => attachMsg("test"))
    }

    function attachMsg(data) {
        console.log(data);
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