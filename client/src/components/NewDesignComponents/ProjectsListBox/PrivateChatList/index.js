import React, { useContext, useRef, useEffect, useState } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
import CloseButton from '../../../Buttons/CloseButton'
import NewMessageLight from '../NewMessageLight'

const PrivateChatList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const [ newMessage, setNewMessage ] = useState(false)
    const prevActive = useRef()
    
    useEffect(() => {
        let { activeSite, activeGroup , activeChat } = userData
        prevActive.current = { activeSite, activeGroup , activeChat }
    })  //TODO: useEffect to check for dependency
    
    function handleClick(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({type: "load-chat", payload: {chat}})
    }
    
    if (!userData) return null //<div>Loading...</div>
    const chats = userData.chats
    
    function addClasses(chat){
        const classList = [styles.list]

        if (chat === userData.activeChat) classList.push(styles.selected)
        if (userData.onlineMembers.includes(chat)) classList.push(styles.online)

        return classList.join(' ')
    }
    
    return (
        <div className={styles.container}>
            <div className={styles['chats-title']}>Private Chats</div>
            <div className={styles['chats-container']}>
                {Object.keys(chats).map(chat => {
                    return (
                        <div key={chat}
                            className={addClasses(chat)}
                            onClick={(e) => handleClick(e, chat)}>
                                <span>{chats[chat].username}</span>
                                {chats[chat].unread && chat !== userData.activeChat ? <NewMessageLight /> : null}
                                <CloseButton chat={chat} lastActive={prevActive.current}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default PrivateChatList