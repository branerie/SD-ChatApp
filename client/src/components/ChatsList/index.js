import { useContext } from 'react'
import styles from './index.module.css'

import ListHeader from '../Common/ListHeader'
import UserAvatar from '../Common/UserAvatar'
import Icon from '../Common/Icon'

import { MessagesContext } from '../../context/MessagesContext'

const ChatsList = ({ isSmallList }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function handleClick(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        if (chat === userData.activeChat) return
        dispatchUserData({ type: "load-chat", payload: { chat } })
    }

    function showUserInfo(id) {
        dispatchUserData({ type: 'show-details', id, show: true })
    }

    function setClasses(chat) {
        const classList = [styles.card]
        classList.push(isSmallList ? styles.small : styles.large)
        classList.push(userData.associatedUsers[chat].online ? styles.online : styles.offline)
        chat === userData.activeChat && classList.push(styles.selected)
        return classList.join(' ')
    }

    function setAbbreviation(string) {
        return string.split(' ', 3).map(word => word[0]).join('')
    }

    const chats = Object.keys(userData.chats)
    // Sort: Non. Default is in the order they are opened

    return (
        <div className={`${styles.container} ${isSmallList ? styles.shrink : styles.expand}`}>
            <ListHeader title={`chats (${chats.length})`}/>
            <div className={styles.list}>
                {isSmallList
                    ? chats.map(chat => {
                        return (
                            <div
                                key={chat}
                                className={setClasses(chat)}
                                onClick={(e) => handleClick(e, chat)}>
                                {userData.associatedUsers[chat].picture
                                    ? <UserAvatar picturePath={userData.associatedUsers[chat].picture} />
                                    : setAbbreviation(userData.associatedUsers[chat].name)
                                }
                            </div>
                        )
                    })
                    : chats.map(chat => {
                        return (
                            <div key={chat} className={setClasses(chat)}>
                                <div className={styles.title} onClick={(e) => handleClick(e, chat)}>
                                    <UserAvatar picturePath={userData.associatedUsers[chat].picture} onlineStatus={true} isOnline={userData.associatedUsers[chat].online}/>
                                    <div className={styles.name}>{userData.associatedUsers[chat].name}</div>
                                </div>
                                <div className={styles.icons}>
                                    {userData.chats[chat].unread > 0 && chat !== userData.activeChat
                                        && <Icon icon='msg' count={userData.chats[chat].unread} onClick={(e) => handleClick(e, chat)}/>
                                    }
                                    {userData.device === 'mobile' &&
                                        <Icon icon='info' onClick={() => showUserInfo(chat)} />
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}

export default ChatsList