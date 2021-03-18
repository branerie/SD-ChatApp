import { useEffect, useContext, useRef, useCallback } from 'react'
import styles from './index.module.css'
import ChatTitle from './ChatTitle'
import Message from './Message'
import Notice from './Notice'
import DateSeparator from './DateSeparator'
import SendMessageBox from './SendMessageBox'

import { MessagesContext } from '../../context/MessagesContext'
import useImageDragAndDrop from '../../hooks/useImageDragAndDrop'
import { uploadImage } from '../../utils/image'

const ChatWindow = () => {
    const { userData, sendMessage } = useContext(MessagesContext)
    const messagesRef = useRef()

    useImageDragAndDrop(messagesRef, async (files) => {
        for (let file of files) {
            const imgLink = await uploadImage(file)
            if (imgLink.error) {
                //TODO: Handle image upload error
                return
            }

            sendMessage(imgLink, 'image')
        }
    })

    const scrollDown = useCallback(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }, [])

    useEffect(scrollDown, [userData, scrollDown])

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
                    let newDate = thisDate !== prevDate
                    let sameUser = i > 0 && !newDate && messages[i].src === messages[i - 1].src
                    return (
                        <div key={i} >
                            {newDate && <DateSeparator date={thisDate} />}
                            {notice
                                ? <Notice message={{ msg, event }} />
                                : <Message
                                    message={{
                                        user: userData.associatedUsers[src] ? userData.associatedUsers[src].name : undefined,
                                        sameUser,
                                        msg,
                                        type,
                                        timestamp,
                                        own: src === userData.personal._id,
                                        avatar: userData.associatedUsers[src] ? userData.associatedUsers[src].picture : undefined
                                    }}
                                    scrollDown={scrollDown}
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
