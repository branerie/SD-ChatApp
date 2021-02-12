import React, { useContext } from 'react'
import styles from './index.module.css'
import StatusLight from '../../CommonComponents/StatusLight'
import { MessagesContext } from '../../../../context/MessagesContext'
import UserAvatar from '../../CommonComponents/UserAvatar'

const Friend = ({ id, name, picturePath, isOnline }) => {
    const { dispatchUserData } = useContext(MessagesContext)

    const openChatWithFriend = () => {
        dispatchUserData({ type: 'open-chat', payload: { user: { _id: id, name: name } } })
    }

    return (
        <div className={styles['friends']} onClick={openChatWithFriend}>
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
