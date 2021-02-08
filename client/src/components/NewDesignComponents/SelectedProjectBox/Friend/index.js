import React, { useContext } from 'react'
import styles from './index.module.css'
import StatusLight from '../../CommonComponents/StatusLight'
import Avatar from 'react-avatar'
import { MessagesContext } from '../../../../context/MessagesContext'

const Friend = ({ id, name }) => {
    const { dispatchUserData } = useContext(MessagesContext)

    const openChatWithFriend = () => {
        dispatchUserData({ type: 'open-chat', payload: { user: { _id: id, name: name } } })
    }

    return (
        <div className={styles['friends']} onClick={openChatWithFriend}>
            <div className={styles['status-light']}>
                <StatusLight color='red' size='small' />
            </div>
            <div className={styles['avatar']}>
                <Avatar size={32} round='5px'  />
            </div>
            <div className={styles['name']}>
                {name}
            </div>

        </div>
    )
}

export default Friend
