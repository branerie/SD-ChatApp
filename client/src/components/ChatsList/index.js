import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../context/MessagesContext'
import UserAvatar from '../Common/UserAvatar'
import StatusLight from '../Common/StatusLight'
import { ReactComponent as MsgEmpty } from '../../icons/msg-empty.svg'
import { ReactComponent as MsgFull } from '../../icons/msg-full.svg'
import { ReactComponent as Info } from '../../icons/info.svg'

const colors = [styles.red, styles.green, styles.blue, styles.orange]

const ChatsList = ({ isSmallList }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    let colorIndex = 0

    function handleClick(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        if (chat === userData.activeChat) return
        dispatchUserData({ type: "load-chat", payload: { chat } })
    }

    const checkIsOnline = (id) => userData.associatedUsers[id].online

    const checkForPicture = (id) => userData.associatedUsers[id].picture

    function addClasses(chat) {
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

    function avatarLetter(line) {
        const splitedName = line.split(' ')
        const firstLatterArray = []
        for (let i = 0; i < splitedName.length; i++) {
            firstLatterArray.push(splitedName[i].charAt(0).toUpperCase())
        }
        const renderLetter = firstLatterArray.join('')
        return renderLetter

    }

    const chats = userData.chats
    // Sort: Non. Default is in the order they are opened

    return (
        <div className={styles.container}>
            <div className={styles['chats-title']}>chats</div>
            <div className={styles['chats-container']}>
                {isSmallList
                    ?
                    Object.keys(chats).map(chat => {
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
                    })
                    :
                    Object.keys(chats).map(chat => {
                        return (
                            <div key={chat} className={styles.list}>
                                <div
                                    className={chat === userData.activeChat ? `${styles.selected} ${styles.chat}` : styles.chat}
                                    onClick={(e) => handleClick(e, chat)}>
                                    <StatusLight isOnline={checkIsOnline(chat)} size='small' />
                                    <UserAvatar picturePath={checkForPicture(chat)} />
                                    {/* {chats[chat].unread && chat !== userData.activeChat ? <NewMessageLight /> : null} */}
                                    <span className={styles['user-name']}>{userData.associatedUsers[chat].name}</span>
                                </div>
                                <div className={styles.icons}>
                                    {chats[chat].unread && chat !== userData.activeChat
                                        ? <MsgFull className={styles.full} />
                                        : <MsgEmpty className={styles.empty} />
                                    }
                                    {userData.device === 'mobile' &&
                                        <Info onClick={() => dispatchUserData({ type: 'show-details', id: chat, show: true })}/>
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