import styles from './index.module.css'
import CurrentChatWindow from './CurrentChatWindow/'

const ChatBox = () => {
    return (
        <div className={styles['chat-box']}>
            <CurrentChatWindow />
        </div>
    )
}

export default ChatBox
