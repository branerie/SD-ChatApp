import React, {useState, useEffect, useContext} from 'react'
import styles from './index.module.css'
import TextareaAutosize from 'react-textarea-autosize'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'

const TextArea = (props) => {
    const [searchWord, setSearchWord] = useState('')
    const [inputTextSyle, setInputTextSyle] = useState('input')
    const [msg, setMsg] = useState('')
    const { userData, dispatchUserData} = useContext(MessagesContext)
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
            dispatchUserData({type: recipientType, payload: { user: userData.personal.username, msg, site, group: recipient, chat: recipient }})
        })
        return
    }


    useEffect(() => {
        if (searchWord) {
            setInputTextSyle('input-writing')
        } else {
            setInputTextSyle('input')
        }
        return
    }, [searchWord])

    return (
        // <textarea
        //     placeholder={props.placeholder}
        //     className={styles[inputTextSyle]}
        //     onFocus={e => {searchWord ? setSearchWord(e.target.value) : e.target.placeholder = props.placeholder} }
        //     onChange={e => setSearchWord(e.target.value)}
        //     value={searchWord}
        //     row='1'
        // />
        // <form onSubmit={e => sendMessage(e)}>
            <TextareaAutosize 
                className={styles['text-area']}
                placeholder={props.placeholder}
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyPress={e => getKey(e)}
                autoFocus
                maxRows={4}
                minRows={1}
            />
    )
}

export default TextArea
