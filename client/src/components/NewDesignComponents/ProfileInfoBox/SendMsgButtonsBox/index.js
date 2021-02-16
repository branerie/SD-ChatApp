import React, { useContext } from 'react'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'
import styles from './index.module.css'
import MessageButton from './MessageButton'
import MoreOptButton from './MoreOptButton'

const SendMsgButtonsBox = ({ userId, name }) => {
    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    const openChatWithFriend = () => {
        if (!userId || !name) return

        socket.emit('get-chat-history', userId, (chat) => {
            dispatchUserData({ type: 'open-chat', payload: { id: userId, chat } })
        })
    }

    return (
        <div className={styles['send-message-box']}>
            <div onClick={openChatWithFriend}>
                <MessageButton />
            </div>
            <div >
                <MoreOptButton />
            </div>
        </div>
    )
}

export default SendMsgButtonsBox
