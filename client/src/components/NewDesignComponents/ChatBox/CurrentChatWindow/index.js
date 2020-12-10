import React from 'react'
import styles from './index.module.css'
import ChatTitle from './ChatTitle/'
import NewMessage from './NewMessage/'
import DevLine from './DevLine/'
import SendMessageBox from './SendMessageBox'


const CurrentChatWindow = () => {
    return (
        <div className={styles['current-chat-window']}>
            <ChatTitle />
            <div className={styles['message-box']}>
                <NewMessage />
                <DevLine />
                <NewMessage />
                <NewMessage />
            </div>
            <SendMessageBox />
        </div>
    )
}

export default CurrentChatWindow
