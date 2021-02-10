import React, { useEffect, useContext, useRef, useState, useMemo } from 'react'
import styles from './index.module.css'
import ChatTitle from './ChatTitle/'
import UserNav from './UserNav/'
import NewMessage from './NewMessage/'
import DevLine from './DevLine/'
import SendMessageBox from './SendMessageBox'

import { MessagesContext } from '../../../../context/MessagesContext'

const CurrentChatWindow = (props) => {

    const { userData } = useContext(MessagesContext)
    const messagesRef = useRef()

    useEffect(() => messagesRef.current.scrollTop = messagesRef.current.scrollHeight)

    // TODO: When MessagesContext is changed to hold user data separately, should be removed
    // and access to users' profile pics should be made directly from there
    const allUsers = useMemo(() => {
        if (!userData) return null

        return Object.values(userData.sites).reduce((acc, site) => { 
            const groups = Object.values(site.groups)
    
            const newAcc = { ...acc }
            groups.forEach(g => g.members.forEach(m => newAcc[[m.username]] = m ))
    
            return newAcc
        }, {})
    }, [userData])

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
        title = `@${userData.chats[userData.activeChat].username}`
    } else if (userData.activeSite) {
        let project = userData.sites[userData.activeSite].name
        let group = userData.sites[userData.activeSite].groups[userData.activeGroup].name
        messages = userData.sites[userData.activeSite].groups[userData.activeGroup].messages
        title = `#${group} (${project})`
    } else {
        messages = [{
            user: "SERVER",
            msg: [`Welcome to SmartChat Network ${userData.personal.name}.`,
            "If you don't have any membership yet, you can create your own projects or join an existing project.",
            "By the time, we suggest you complete your profile by adding some info about yourself.",
            "If skipped now, this can be done later from the settings button."
        ].join('\n'),
            timestamp: new Date().toUTCString(),
            own: false
        }]
        title = `Welcome ${userData.personal.name}`
        msgBox = false
    }

    return (
        <div className={styles['current-chat-window']}>
            <UserNav />
            <ChatTitle title={title}/>
            <div ref={messagesRef} className={styles['message-box']}>
                {messages.map(({ user, username, msg, timestamp, own }, i) => {
                    let thisDate = new Date(timestamp).toDateString()
                    let prevDate = i > 0 ? new Date(messages[i - 1].timestamp).toDateString() : undefined
                    return (
                        <div key={i} >
                            {thisDate !== prevDate && <DevLine date={thisDate} />}
                            <NewMessage message={{ 
                                user, 
                                msg, 
                                timestamp, 
                                own,
                                avatar: allUsers[[username]] ? allUsers[[username]].picture : null}}
                            />
                        </div>
                    )
                })}
            </div>
            {msgBox && <SendMessageBox />}
        </div>
    )
}

export default CurrentChatWindow
