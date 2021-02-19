import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
// import { SocketContext } from '../../../../../context/SocketContext'

const Group = ({ title, gid }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    // const { socket } = useContext(SocketContext)

    if (!userData || !userData.activeSite) return null //<div>Loading...</div>

    function loadGroup(activeGroup) {
        // socket.emit('update-atime', activeGroup, () => {}) //todo
        dispatchUserData({ type: "load-group", payload: { activeGroup } })
    }

    return <div
        className={`${styles.group} ${gid === userData.activeGroup && styles.selected}`}
        onClick={() => loadGroup(gid)}
    >
        {title}</div>
}

export default Group
