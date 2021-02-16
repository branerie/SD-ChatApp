import React, { useContext, useRef, useEffect } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
import CloseChat from '../../../Buttons/CloseChat'
import CloseButton from '../../ChatBox/CurrentChatWindow/ChatTitle/CloseButton/index'
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

    const checkIsOnline = (id) => userData.associatedUsers[id].online

    const checkForPicture = (id) => userData.associatedUsers[id].picture

    function addClasses(chat){
        const classList = [styles.smallList]

        if (checkIsOnline(chat)) {
            classList.push(styles.online)
        } else {
            classList.push(styles.offline)
        }

        if (chat === userData.activeChat) classList.push(styles.selected)

        if (!checkForPicture(chat)) {
        const currentColorIndex = colorIndex % colors.length
        const currentColor = colors[currentColorIndex]
        classList.push(currentColor)
        }

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
    const chats = userData.chats

    return (
        <div className={styles.container}>
            <div className={styles['chats-title']}>Private Chats</div>
                {isSmallList
                ?
                    <div className={styles['chats-container']}>
                        {Object.keys(chats).map(chat =>{
                            const picForAvatar = checkForPicture(chat)
                            return (
                                <div 
                                    key={chat}
                                    className={addClasses(chat)}
                                    onClick={(e) => handleClick(e, chat)}>
                                        {picForAvatar
                                        ? <UserAvatar picturePath={picForAvatar} />
                                        : <div>{avatarLetter(userData.associatedUsers[chat].name)}</div>}
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
                                            <StatusLight isOnline={checkIsOnline(chat)} size='small'/>
                                            <UserAvatar picturePath={checkForPicture(chat)} />
                                            {chats[chat].unread && chat !== userData.activeChat ? <NewMessageLight /> : null}
                                            <span className={styles['user-name']}>{userData.associatedUsers[chat].name}</span>
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