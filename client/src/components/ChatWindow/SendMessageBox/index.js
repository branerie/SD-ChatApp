import { useContext, useState } from 'react'
import css from './index.module.css'
import TextArea from '../../Common/TextArea'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
// import sendFile from '../../../icons/attach.svg'
// import voiceMsg from '../../../icons/record.svg'


const SendMessageBox = () => {
    const [msg, setMsg] = useState('')
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

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
        <div className={css.container}>
            {/* <div className={css.file}>
                <img src={sendFile} alt=''/>
            </div>
            <div className={css.voice}>
                <img src={voiceMsg} alt=''/>
            </div> */}
            <div className={css.text}>
                <TextArea msg={msg} setMsg={setMsg} sendMessage={sendMessage} />
            </div>
            <div className={css.send} onClick={sendMessage}>
                Send
            </div>
        </div>
    )
}

export default SendMessageBox
