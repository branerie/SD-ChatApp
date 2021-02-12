import React, { useContext, useRef, useEffect, useState } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
import CloseButton from '../../../Buttons/CloseButton'
import NewMessageLight from '../NewMessageLight'
import UserAvatar from '../../CommonComponents/UserAvatar'
import StatusLight from '../../CommonComponents/StatusLight'
import ProjectCircle from '../ProjectCircle'

const PrivateChatList = ({isSmallList}) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
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

    return (
        <div className={styles.container}>
            <div className={styles['chats-title']}>Private Chats</div>
                {isSmallList
                ?
                    <div className={styles['chats-container']}>
                        {Object.keys(chats).map(chat =>{
                            return (
                                <ProjectCircle name={chats[chat].username} />
                            )
                        })}
                    </div>
                :
                    <div className={styles['chats-container']}>
                        {Object.keys(chats).map(chat => {
                            return (
                                <div className={styles.list} >
                                    <div key={chat}
                                        className={chat === userData.activeChat ? `${styles.selected} ${styles.chat}` : styles.chat}
                                        onClick={(e) => handleClick(e, chat)}>
                                            <StatusLight userId={chat} size='small'/>
                                            <UserAvatar picturePath={chats[chat].username.picture} />
                                            {chats[chat].unread && chat !== userData.activeChat ? <NewMessageLight /> : null}
                                            <span className={styles['user-name']}>{chats[chat].username}</span>
                                    </div>
                                    <CloseButton chat={chat} lastActive={prevActive.current}/>
                                </div>
                            )
                        })}
                    </div>
            }
        </div>
    )

}

export default PrivateChatList