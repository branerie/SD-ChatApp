import { useState, useContext } from 'react'
import styles from './index.module.css'
import closeButton from '../../../../../images/closeButton.svg'
import closeButtonHover from '../../../../../images/closeButtonHover.svg'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const CloseButton = ({chat, prevActive}) => {
    const [closeButtonSrc, setCloseButtonSrc] = useState(closeButton)
    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function handleClick() {
            socket.emit('close-chat', chat)
            dispatchUserData({ type: 'close-chat', payload: { chat, prevActive } })
    }

    return (
            <img
                className={styles['close-button']}
                src={closeButtonSrc}
                onMouseEnter={() => { setCloseButtonSrc(closeButtonHover) }}
                onMouseOut={() => { setCloseButtonSrc(closeButton) }}
                onClick={handleClick}
                alt='Close chat'
            />
    )
}

export default CloseButton
