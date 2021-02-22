import styles from './index.module.css'
import sendFile from '../../../../images/sendFile.svg'
import voiceMsg from '../../../../images/voiceMsg.svg'
import TextArea from '../../../Common/TextArea'


const SendMessageBox = () => {
    return (
        <div className={styles['send-msg-box']}>
            <div className={styles['send-file']}>
                <img src={sendFile} alt=''/>
            </div>
            <div className={styles['voice-msg']}>
                <img src={voiceMsg} alt=''/>
            </div>
            <div className={styles['text-area-box']}>
                <TextArea />
            </div>
        </div>
    )
}

export default SendMessageBox
