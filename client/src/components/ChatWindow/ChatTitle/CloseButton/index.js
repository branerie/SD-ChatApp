import { useContext } from 'react'
import styles from './index.module.css'
import closeButton from '../../../../icons/close-x.svg'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'

const CloseButton = ({chat}) => {
    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function handleClick() {
            socket.emit('close-chat', chat)
            dispatchUserData({ type: 'close-chat', payload: { chat } })
    }

    return (
            <img
                className={styles.btn}
                src={closeButton}
                onClick={handleClick}
                alt='Close chat'
            />
    )
}

export default CloseButton
