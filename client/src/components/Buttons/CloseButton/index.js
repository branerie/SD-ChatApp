import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'

const CloseButton = ({ chat, lastActive }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function handleClick() {
            socket.emit('close-chat', chat)
            dispatchUserData({ type: 'close-chat', payload: { chat, lastActive } })
    }
    return (
        <button className='close-btn' onClick={handleClick}>X</button>
    )
}

export default CloseButton