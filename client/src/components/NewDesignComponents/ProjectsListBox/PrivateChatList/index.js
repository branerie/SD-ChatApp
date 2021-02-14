import React, { useContext, useRef, useEffect } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
import CloseChat from '../../../Buttons/CloseChat'
import NewMessageLight from '../NewMessageLight'
import UserAvatar from '../../CommonComponents/UserAvatar'
import StatusLight from '../../CommonComponents/StatusLight'

const PrivateChatList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const prevActive = useRef()

    useEffect(() => {
        let { activeSite, activeGroup, activeChat } = userData
        prevActive.current = { activeSite, activeGroup, activeChat }
    })  //TODO: useEffect to check for dependency

    function handleClick(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        if (chat === userData.activeChat) return
        dispatchUserData({ type: "load-chat", payload: { chat } })
    }

    if (!userData) return null //<div>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles['chats-title']}>Private Chats</div>
            <div className={styles['chats-container']}>
                {Object.keys(userData.chats).map(chat => {
                    return (
                        <div key={chat} className={styles.list} >
                            <div
                                className={chat === userData.activeChat ? `${styles.selected} ${styles.chat}` : styles.chat}
                                onClick={(e) => handleClick(e, chat)}>
                                <StatusLight isOnline={userData.associatedUsers[chat].online} size='small' />
                                <UserAvatar picturePath={userData.associatedUsers[chat].picture} />
                                {userData.chats[chat].unread && chat !== userData.activeChat ? <NewMessageLight /> : null}
                                <span className={styles['user-name']}>{userData.associatedUsers[chat].name}</span>
                            </div>
                            <CloseChat chat={chat} prevActive={prevActive.current} />
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default PrivateChatList