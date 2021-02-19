import styles from './index.module.css'
import UserAvatar from '../../../Common/UserAvatar'

const Message = ({ message }) => {

    function getTime(timestamp) {
        return new Date(timestamp).toTimeString().split(':', 2).join(':')
    }

    return (
        <div className={`${styles.container} ${message.own && styles.own}`}>
            <UserAvatar picturePath={message.avatar} />
            <div className={`${styles.data} ${message.own && styles.owndata}`}>
                <div className={styles.name}>
                    {message.user}
                </div>
                <div className={styles.time}>
                    {getTime(message.timestamp)}
                </div>
                <div className={styles.message}>
                    {message.msg}
                </div>
            </div>
        </div>

    )
}

export default Message
