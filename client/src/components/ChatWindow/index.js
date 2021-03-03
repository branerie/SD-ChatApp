import { useEffect, useContext, useRef } from 'react'
import styles from './index.module.css'
import ChatTitle from './ChatTitle'
import Message from './Message'
import Notice from './Notice'
import DateSeparator from './DateSeparator'
import SendMessageBox from './SendMessageBox'

import { MessagesContext } from '../../context/MessagesContext'

const ChatWindow = () => {
    const { userData } = useContext(MessagesContext)
    const messagesRef = useRef()

    useEffect(() => messagesRef.current.scrollTop = messagesRef.current.scrollHeight, [userData])

    let messages, title
    if (userData.activeChat) {
        messages = userData.chats[userData.activeChat].messages
        title = userData.activeChat === userData.personal._id ? 'Notes' : `@${userData.associatedUsers[userData.activeChat].name}`
    } else {
        messages = userData.sites[userData.activeSite].groups[userData.activeGroup].messages
        title = `#${userData.sites[userData.activeSite].groups[userData.activeGroup].name}`
    }

    return (
        <div className={styles.container}>
            <ChatTitle title={title} privChat={userData.activeChat} />
            <div ref={messagesRef} className={styles.messages}>
                {messages.map(({ src, msg, type, timestamp, notice, event }, i) => {
                    let thisDate = new Date(timestamp).toDateString()
                    let prevDate = i > 0 ? new Date(messages[i - 1].timestamp).toDateString() : undefined
                    return (
                        <div key={i} >
                            {thisDate !== prevDate && <DateSeparator date={thisDate} />}
                            {notice
                                ? <Notice message={{ msg, event }} />
                                : <Message message={{
                                    user: userData.associatedUsers[src] ? userData.associatedUsers[src].name : null,
                                    msg,
                                    type,
                                    timestamp,
                                    own: src === userData.personal._id,
                                    avatar: userData.associatedUsers[src] ? userData.associatedUsers[src].picture : null
                                }}
                                />
                            }
                        </div>
                    )
                })}
            </div>
            <SendMessageBox />
        </div>
    )
}

export default ChatWindow
