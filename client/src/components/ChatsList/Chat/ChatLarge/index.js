import { useContext } from 'react'
import css from '../index.module.css'

import UserAvatar from '../../../Common/UserAvatar'

import Icon from '../../../Common/Icon'

import { MessagesContext } from '../../../../context/MessagesContext'

const ChatLarge = ({ chat, unread }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { name, picture, online } = userData.associatedUsers[chat]

    function loadChat(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        if (chat === userData.activeChat) return
        dispatchUserData({ type: "load-chat", payload: { chat } })
    }

    function showUserInfo(id) {
        dispatchUserData({ type: 'show-details', id, show: true })
    }

    function setClasses(chat) {
        const classList = [css.card, css.large]
        classList.push(online ? css.online : css.offline)
        chat === userData.activeChat && classList.push(css.selected)
        return classList.join(' ')
    }

    return (
        <div className={setClasses(chat)}>
            <div className={css.title} onClick={(e) => loadChat(e, chat)}>
                <UserAvatar picturePath={picture} onlineStatus={true} isOnline={online} />
                <div className={css.name}>{name}</div>
            </div>
            <div className={css.icons}>
                {unread > 0 && chat !== userData.activeChat
                    && <Icon icon='msg' count={unread} onClick={(e) => loadChat(e, chat)} />
                }
                {userData.device === 'mobile' &&
                    <Icon icon='info' onClick={() => showUserInfo(chat)} />
                }
            </div>
        </div>
    )
}

export default ChatLarge