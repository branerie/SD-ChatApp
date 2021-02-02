import React, { useEffect, useContext, useRef } from 'react'
import styles from './index.module.css'
import ChatTitle from './ChatTitle/'
import NewMessage from './NewMessage/'
import DevLine from './DevLine/'
import SendMessageBox from './SendMessageBox'

import { MessagesContext } from '../../../../context/MessagesContext'

const CurrentChatWindow = (props) => {

    const context = useContext(MessagesContext)
    const messagesRef = useRef()

    useEffect(() => messagesRef.current.scrollTop = messagesRef.current.scrollHeight)

    if (!context.userData) return (
        <div className={styles['current-chat-window']}>
            <ChatTitle title={props.title} />
            <div ref={messagesRef} className={styles['message-box']}>
                Loading messages....
            </div>
            <SendMessageBox />
        </div>
    )

    let messages
    if (context.userData.activeChat) {
        messages = context.userData.chats[context.userData.activeChat].messages
    } else if (context.userData.activeSite) {
        messages = context.userData.sites[context.userData.activeSite].groups[context.userData.activeGroup].messages
    } else {
        messages = [{
            user: "SERVER",
            msg: `Welcome to SmartChat Network ${context.userData.personal.username}.
            If you don't have any membership yet,
            you can create your own projects or join an existing project from the menu on the left.`,
            timestamp: new Date().toLocaleTimeString()
        }]
    }

    return (
        <div className={styles['current-chat-window']}>
            <ChatTitle title={context.userData.sites[context.userData.activeSite].groups[context.userData.activeGroup].name} />
            <div ref={messagesRef} className={styles['message-box']}>
                {messages.map(({ user, msg, timestamp }, i) => {
                    let thisDate = new Date(timestamp).toDateString()
                    let prevDate = i > 0 ? new Date(messages[i - 1].timestamp).toDateString() : undefined
                    return (
                        <div key={i} >
                            {thisDate !== prevDate && <DevLine date={thisDate} />}
                            <NewMessage message={{ user, msg, timestamp }} />
                        </div>
                    )
                })}
            </div>
            <SendMessageBox />
        </div>
    )
}

export default CurrentChatWindow
