import React, { useContext } from 'react'
import styles from './index.module.css'
import StatusLight from '../../CommonComponents/StatusLight'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'
import UserAvatar from '../../CommonComponents/UserAvatar'

const Friend = ({ id, name, picturePath, isOnline }) => {
    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    const openPrivateChat = () => {
        socket.emit('get-chat-history', id, (chat) => {
            dispatchUserData({ type: 'open-chat', payload: { id, chat } })
        })
    }

    return (
        <div className={styles['friends']} onClick={openPrivateChat}>
            <div className={styles['status-light']}>
                    <StatusLight userId={id} isOnline={isOnline} size='small' />
            </div>
            <UserAvatar picturePath={picturePath} />
            <div className={styles['name']}>
                {name}
            </div>

        </div>
    )
}

export default Friend
