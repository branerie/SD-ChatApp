import React from 'react'
import styles from './index.module.css'
import CurrentChatWindow from './CurrentChatWindow/'

const ChatBox = () => {
    return (
        <div className={styles['chat-box']}>
            <CurrentChatWindow />
            <CurrentChatWindow />  
        </div>
    )
}

export default ChatBox
