import { useContext } from 'react'
import css from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
// import { SocketContext } from '../../../../../context/SocketContext'

import Icon from '../../../Common/Icon'

const Group = ({ title, gid }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    // const { socket } = useContext(SocketContext)

    function loadGroup(activeGroup) {
        // socket.emit('update-atime', activeGroup, () => {}) //todo
        dispatchUserData({ type: "load-group", payload: { activeGroup } })
    }

    function loadMembers(gid) {
        dispatchUserData({ type: 'load-members-mobile', payload: { activeGroup: gid } })
    }

    return (
        <div className={`${css.group} ${gid === userData.activeGroup && css.selected}`}>
            <div className={css.title} onClick={() => loadGroup(gid)}>{title}</div>
            <div className={css.icons}>
                {userData.sites[userData.activeSite].groups[gid].unread > 0 &&
                    <Icon icon='msg' count={userData.sites[userData.activeSite].groups[gid].unread} onClick={() => loadGroup(gid)} />
                }
                {userData.device === 'mobile' &&
                    <Icon icon='members' onClick={() => loadMembers(gid)} />
                }

            </div>
        </div>
    )
}

export default Group
