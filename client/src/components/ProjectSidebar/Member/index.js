import { useContext } from 'react'
import styles from './index.module.css'
import StatusLight from '../../Common/StatusLight'
import UserAvatar from '../../Common/UserAvatar'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'

import { ReactComponent as InfoButton } from '../../../icons/info.svg'
import { shortenText } from '../../../utils/text'

const Member = ({ id, name, picturePath, isOnline }) => {
    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    const openPrivateChat = () => {
        socket.emit('get-chat-history', id, (chat) => {
            dispatchUserData({ type: 'open-chat', payload: { id, chat } })
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.member} onClick={openPrivateChat}>
                <div className={styles.status}>
                    <StatusLight userId={id} isOnline={isOnline} size='small' />
                </div>
                <UserAvatar picturePath={picturePath} />
                <div className={styles.name}>
                    {name}
                </div>
            </div>
            <InfoButton 
                className={styles.info} 
                alt='Link to user info' 
                onClick={() => dispatchUserData({ type: 'show-details', id, show: true })}
            />
        </div>
    )
}

export default Member
