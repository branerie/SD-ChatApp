import React from 'react'
import styles from './index.module.css'
import UserAvatar from '../../../CommonComponents/UserAvatar'

const Message = ({ message }) => {

    function getTime(timestamp) {
        return new Date(timestamp).toTimeString().split(':', 2).join(':')
    }
    
    return (
        <div className={`${styles['new-message']} ${message.own && styles['new-message-own']}`}>
            <div className={styles['info']}>
                <UserAvatar picturePath={message.avatar} />
            </div>
            <div className={`${styles['text-box']} ${message.own && styles['text-box-own']}`}>
                <div className={styles['name']}>
                    {message.user}
                </div>
                <div className={styles['time']}>
                    {getTime(message.timestamp)}
                </div>
                <div className={styles['message']}>
                    {message.msg}
                </div>
            </div>
        </div>

    )
}

export default Message
