import { useContext } from 'react'
import css from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
// import { SocketContext } from '../../../../../context/SocketContext'
import { ReactComponent as MsgEmpty } from '../../../../icons/msg-empty.svg'
import { ReactComponent as MsgFull } from '../../../../icons/msg-full.svg'
import { ReactComponent as Members } from '../../../../icons/chat-group.svg'

const Group = ({ title, gid }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    // const { socket } = useContext(SocketContext)

    function loadGroup(activeGroup) {
        // socket.emit('update-atime', activeGroup, () => {}) //todo
        dispatchUserData({ type: "load-group", payload: { activeGroup } })
    }

    function loadMembers(gid) {
        dispatchUserData({ type: 'load-members-mobile', payload: {activeGroup: gid} })
    }

    return (
        <div
            className={`${css.group} ${gid === userData.activeGroup && css.selected}`}           
        >
            <div className={css.title} onClick={() => loadGroup(gid)}>{title}</div>
            <div className={css.icons}>
                {userData.sites[userData.activeSite].groups[gid].unread 
                ? <MsgFull onClick={() => loadGroup(gid)} className={css.full} />
                : <MsgEmpty onClick={() => loadGroup(gid)} className={css.empty}/>
                }
                {userData.device === 'mobile' &&
                    <Members onClick={() => loadMembers(gid)}/>
                }
            </div>
        </div>
    )
}

export default Group
