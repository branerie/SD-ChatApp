import React from 'react'
import styles from './index.module.css'
import sendFile from '../../../../../images/sendFile.svg'
import voiceMsg from '../../../../../images/voiceMsg.svg'
import TextArea from '../../../CommonComponents/TextArea'


const SendMessageBox = () => {
    return (
        <div className={styles['send-msg-box']}>
            <div className={styles['send-file']}>
                <img src={sendFile} />
            </div>
            <div className={styles['voice-msg']}>
                <img src={voiceMsg} />
            </div>
            <div className={styles['text-area-box']}>
                <TextArea placeholder='Message'/>
            </div>
        </div>
    )
}

export default SendMessageBox
