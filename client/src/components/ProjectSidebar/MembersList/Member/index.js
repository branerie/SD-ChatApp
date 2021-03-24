import { useContext } from 'react'
import css from './index.module.css'

import UserAvatar from '../../../Common/UserAvatar'
import Icon from '../../../Common/Icon'

import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'


const Member = ({ id, name, picturePath, isOnline }) => {
    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    const openPrivateChat = () => {
        socket.emit('get-chat-history', id, chat => {
            dispatchUserData({ type: 'open-chat', payload: { id, chat } })
        })
    }

    function showUserInfo() {
        dispatchUserData({ type: 'show-details', id, show: true })
    }

    return (
        <div className={css.container}>
            <div className={css.title} onClick={openPrivateChat}>
                <UserAvatar picturePath={picturePath} onlineStatus={true} isOnline={isOnline}/>
                <div className={css.name}>{name}</div>
            </div>
            <div className={css.icons}>
                <Icon icon='info' onClick={showUserInfo} />
            </div>
        </div>
    )
}

export default Member
