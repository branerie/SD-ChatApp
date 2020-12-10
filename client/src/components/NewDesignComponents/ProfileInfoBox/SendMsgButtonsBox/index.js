import React from 'react'
import styles from './index.module.css'
import MessageButton from './MessageButton'
import MoreOptButton from './MoreOptButton'

const SendMsgButtonsBox = () => {
    return (
        <div className={styles['send-message-box']}>
            <div>
                <MessageButton />
            </div>
            <div >
                <MoreOptButton />
            </div>
        </div>
    )
}

export default SendMsgButtonsBox
