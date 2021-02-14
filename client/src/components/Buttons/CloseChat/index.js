import React, { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'

const CloseChat = ({ chat, prevActive }) => {
    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function handleClick() {
            socket.emit('close-chat', chat)
            dispatchUserData({ type: 'close-chat', payload: { chat, prevActive } })
    }
    return (
        <div className={styles['close-btn']} onClick={handleClick}>
            <div className={styles.right} ></div>
            <div className={styles.left} ></div>
        </div>
    )
}

export default CloseChat