import styles from './index.module.css'
import UserAvatar from '../../Common/UserAvatar'
import PlainMessage from './PlainMessage'
import UriMessage from './UriMessage'
import ImageMessage from './ImageMessage'

const Message = ({ message }) => {

    const msg = {
        plain: <PlainMessage msg={message.msg}/>,
        uri: <UriMessage msg={message.msg}/>,
        image: <ImageMessage msg={message.msg}/>
    }

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
                    {msg[message.type]}
                </div>
            </div>
        </div>

    )
}

export default Message
