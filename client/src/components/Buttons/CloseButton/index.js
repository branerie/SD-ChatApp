import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'

const CloseButton = ({ name, type, item }) => {
    const { updateChats, changeWindow } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    function handleClick() {
        if (type === 'chat') {
            changeWindow("STATUS", false)
            updateChats(item, 'close')
            socket.emit('close-chat', item)
        }
        // else >>> group : Leave group logic
    }
    return (
        <button className='close-btn' onClick={handleClick}>{name}</button>
    )
}

export default CloseButton