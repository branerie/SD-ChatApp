import { useContext } from 'react'
import css from '../index.module.css'

import UserAvatar from '../../../Common/UserAvatar'

import { MessagesContext } from '../../../../context/MessagesContext'

const ChatSmall = ({ chat, unread }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { name, picture, online } = userData.associatedUsers[chat]

    function loadChat(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        if (chat === userData.activeChat) return
        dispatchUserData({ type: "load-chat", payload: { chat } })
    }

    function setClasses(chat) {
        const classList = [css.card, css.small]
        classList.push(online ? css.online : css.offline)
        chat === userData.activeChat && classList.push(css.selected)
        return classList.join(' ')
    }

    function setAbbreviation(string) {
        return string.split(' ', 3).map(word => word[0]).join('')
    }

    return (
        <div
            className={setClasses(chat)}
            onClick={(e) => loadChat(e, chat)}>
            {picture ? <UserAvatar picturePath={picture} /> : setAbbreviation(name)}
        </div>
    )
}

export default ChatSmall