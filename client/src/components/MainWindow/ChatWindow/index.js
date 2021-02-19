import { useEffect, useContext, useRef } from 'react'
import styles from './index.module.css'
import ChatTitle from './ChatTitle'
import Message from './Message'
import Notice from './Notice'
import DateSeparator from './DateSeparator'
import SendMessageBox from './SendMessageBox'

import { MessagesContext } from '../../../context/MessagesContext'

const ChatWindow = (props) => {

    const { userData } = useContext(MessagesContext)
    const messagesRef = useRef()

    useEffect(() => messagesRef.current.scrollTop = messagesRef.current.scrollHeight, [userData])

    if (!userData) return (
        <div className={styles['current-chat-window']}>
            <ChatTitle title={props.title} />
            <div ref={messagesRef} className={styles['message-box']}>
                Loading messages....
            </div>
        </div>
    )

    let messages, title, msgBox = true
    if (userData.activeChat) {
        messages = userData.chats[userData.activeChat].messages
        title = userData.activeChat === userData.personal._id ? 'Notes' : `@${userData.associatedUsers[userData.activeChat].name}`
    } else if (userData.activeSite) {
        messages = userData.sites[userData.activeSite].groups[userData.activeGroup].messages
        title = `#${userData.sites[userData.activeSite].groups[userData.activeGroup].name}`
    } else {
        messages = [{
            user: "SERVER",
            msg: [`Welcome to SmartChat Network ${userData.personal.name}.`,
                "If you don't have any membership yet, you can create your own projects or join an existing project.",
                "By the time, we suggest you complete your profile by adding some info about yourself.",
                "If skipped now, this can be done later from the profile menu."
            ].join('\n'),
            timestamp: new Date().toUTCString(),
            own: false
        }]
        title = `Welcome ${userData.personal.name}`
        msgBox = false
    }

    return (
        <div className={styles.container}>
            <ChatTitle title={title} />
            <div ref={messagesRef} className={styles.messages}>
                {messages.map(({ src, msg, timestamp, notice, event }, i) => {
                    let thisDate = new Date(timestamp).toDateString()
                    let prevDate = i > 0 ? new Date(messages[i - 1].timestamp).toDateString() : undefined
                    return (
                        <div key={i} >
                            {thisDate !== prevDate && <DateSeparator date={thisDate} />}
                            {notice ?
                                <Notice message={{ msg, event }} /> :
                                <Message message={{
                                    user: userData.associatedUsers[src] ? userData.associatedUsers[src].name : null,
                                    msg,
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
            {msgBox && <SendMessageBox />}
        </div>
    )
}

export default ChatWindow
