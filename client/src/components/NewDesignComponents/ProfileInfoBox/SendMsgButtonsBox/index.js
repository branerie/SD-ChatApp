import React, { useContext } from 'react'
import { MessagesContext } from '../../../../context/MessagesContext'
import styles from './index.module.css'
import MessageButton from './MessageButton'
import MoreOptButton from './MoreOptButton'

const SendMsgButtonsBox = ({ userId, name }) => {
    const { dispatchUserData } = useContext(MessagesContext)

    const openChatWithFriend = () => {
        if (!userId || !name) return

        dispatchUserData({ type: 'open-chat', payload: { user: { _id: userId, name } } })
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
