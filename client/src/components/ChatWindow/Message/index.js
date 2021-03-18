import styles from './index.module.css'
import UserAvatar from '../../Common/UserAvatar'
import PlainMessage from './PlainMessage'
import UriMessage from './UriMessage'
import ImageMessage from './ImageMessage'

const Message = ({ message, scrollDown }) => {

    const msg = {
        plain: <PlainMessage msg={message.msg} />,
        uri: <UriMessage msg={message.msg} />,
        image: <ImageMessage msg={message.msg} scrollDown={scrollDown} />
    }

    function getTime(timestamp) {
        return new Date(timestamp).toTimeString().split(':', 2).join(':')
    }

    return (
        <>
            {!message.sameUser &&
                <div className={`${styles.header} ${message.own && styles.own}`}>
                    <div><UserAvatar picturePath={message.avatar} /></div>
                    <div className={styles.name}>{message.user ? message.user : 'Unknown user'}</div>
                </div>
            }
            <div className={`${styles.main} ${message.own && styles.own} ${message.sameUser ? styles.next : styles.first}`}>
                <div className={`${styles.container} ${message.own ? styles.self : styles.rest} ${message.sameUser ? styles.next : styles.first}`}>
                    <div className={styles.message}>{msg[message.type]}</div>
                    <div className={styles.time}>{getTime(message.timestamp)}</div>
                </div>
            </div>
        </>
    )
}

export default Message
