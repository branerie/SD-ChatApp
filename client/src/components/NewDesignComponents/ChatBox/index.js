import styles from './index.module.css'
import CurrentChatWindow from './CurrentChatWindow/'
import UserMenu from './CurrentChatWindow/UserMenu'
import { useContext } from 'react'
import { MessagesContext } from '../../../context/MessagesContext'

const ChatBox = () => {
    const { userData } = useContext(MessagesContext)

    return (
        <div className={styles['chat-box']}>
            {userData.activeMenu ? <UserMenu /> : <CurrentChatWindow />}
        </div>
    )
}

export default ChatBox
