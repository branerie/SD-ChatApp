import { useState, useContext } from 'react'
import Picker from 'emoji-picker-react'
import styles from './index.module.css'
import TextareaAutosize from 'react-textarea-autosize'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'
import useDetectOutsideClick from '../../../../utils/useDetectOutsideClick'
import { replaceEmojis } from '../../../../utils/text'

import emotIcon from '../../../../images/emotIcon.svg'

const TextArea = (props) => {
    const [msg, setMsg] = useState('')
    const { ref, isVisible, setIsVisible } = useDetectOutsideClick()
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function getKey(e) {
        if (e.key !== 'Enter') return
        e.preventDefault()
        sendMessage()
    }

    function sendMessage() {
        let recipientType, recipient, site
        if (userData.activeChat) {
            recipientType = 'single-chat-message'
            recipient = userData.activeChat
            site = null
        } else {
            recipientType = 'group-chat-message'
            recipient = userData.activeGroup
            site = userData.activeSite
        }

        socket.emit(recipientType, { site, recipient, msg }, () => {
            setMsg('')
            if (recipient === userData.personal._id) return
            dispatchUserData({
                type: recipientType,
                payload: {
                    src: userData.personal._id,
                    msg,
                    site,
                    group: recipient,
                    chat: recipient
                }
            })
        })
        return
    }

    return (
        <>
            <TextareaAutosize
                className={styles['text-area']}
                placeholder={props.placeholder}
                value={msg}
                onChange={e => setMsg(replaceEmojis(e.target.value))}
                onKeyPress={e => getKey(e)}
                autoFocus
                maxRows={4}
                minRows={1}
            />
            <div onClick={() => setIsVisible(!isVisible)} className={styles['link-emoji']}>
                <img src={emotIcon} alt=''/>
            </div>
            { isVisible &&
                <div class={styles.emoji} ref={ref}>
                    <Picker onEmojiClick={(e, emojiObj) => setMsg(msg + emojiObj.emoji)} />
                </div>
            }
        </>
    )
}

export default TextArea
