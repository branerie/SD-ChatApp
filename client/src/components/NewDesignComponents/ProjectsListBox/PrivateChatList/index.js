import React, { useContext, useRef, useEffect } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
import CloseChat from '../../../Buttons/CloseChat'
import NewMessageLight from '../NewMessageLight'
import UserAvatar from '../../CommonComponents/UserAvatar'
import StatusLight from '../../CommonComponents/StatusLight'

const colors = [styles.red, styles.green, styles.blue, styles.orange]

const PrivateChatList = ({isSmallList}) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const prevActive = useRef()
    let colorIndex = 0

    useEffect(() => {
        let { activeSite, activeGroup, activeChat } = userData
        prevActive.current = { activeSite, activeGroup, activeChat }
    })  //TODO: useEffect to check for dependency

    function handleClick(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        if (chat === userData.activeChat) return
        dispatchUserData({ type: "load-chat", payload: { chat } })
    }

    function addClasses(chat){
        const classList = [styles.smalList]
        if (chat === userData.activeChat) classList.push(styles.selected)
        const currentColorIndex = colorIndex % colors.length
        const currentColor = colors[currentColorIndex]
        classList.push(currentColor)
        
        colorIndex++

        return classList.join(' ')
    }

    function avatarLetter(line){
        const splitedName = line.split(' ')
        const firstLatterArray = []
        for (let i = 0 ; i < splitedName.length ; i++) {
            firstLatterArray.push(splitedName[i].charAt(0).toUpperCase())
        }
        const renderLetter = firstLatterArray.join('')
        return renderLetter

    }
    
    if (!userData) return null //<div>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles['chats-title']}>Private Chats</div>
                {isSmallList
                ?
                    <div className={styles['chats-container']}>
                        {Object.keys(chats).map(chat =>{
                            return (
                                <div 
                                key={chat}
                                className={addClasses(chat)}
                                onClick={(e) => handleClick(e, chat)}>
                                    <StatusLight userId={chat} size='small'/>
                                    {avatarLetter(chats[chat].username)}
                                </div>
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