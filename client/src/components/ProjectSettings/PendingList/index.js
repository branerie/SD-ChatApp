import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import StatusLight from '../../CommonComponents/StatusLight'
import UserAvatar from '../../CommonComponents/UserAvatar'

const PendingList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function cancelInvitation(user) {
        socket.emit('cancel-invitation', { user, site: userData.activeSite }, () => {
            // dispatchUserData({ type: 'cancel-invitation', payload: { invitation, site: userData.activeSite } })
        })
    }

    function acceptRequest(user) {
        socket.emit('accept-request', { user, site: userData.activeSite }, () => {
            // dispatchUserData({ type: 'accept-request', payload: { request, site } })
        })
    }

    function rejectRequest(user) {
        socket.emit('reject-request', { user, site: userData.activeSite }, () => {
            // dispatchUserData({ type: 'reject-request', payload: { request, site: userData.activeSite } })
        })
    }

    function showInfo(user) {
        dispatchUserData({ type: 'show-info', payload: { user } })
    }

    return (
        <div>
            <p>Pending</p>
            {userData.sites[userData.activeSite].invitations && userData.sites[userData.activeSite].invitations.length > 0 && (
                <ul><span className='header'>Invitations</span>
                    {userData.sites[userData.activeSite].invitations.map(user => {
                        return (
                            <div key={user}>
                                <li className={styles['list-item']}>
                                    <div className={styles.card}>
                                        <StatusLight isOnline={userData.associatedUsers[user].online} size='small' />
                                        <UserAvatar picturePath={userData.associatedUsers[user].picture} />
                                        <span>{userData.associatedUsers[user].name}</span>
                                    </div>
                                    <div>
                                        <button onClick={() => showInfo(user)}>info</button>
                                        <button onClick={() => cancelInvitation(user)}>X</button>
                                    </div>
                                </li>
                                {userData.associatedUsers[user].info && <span>({userData.associatedUsers[user].username})</span>}
                            </div>
                        )
                    })}
                </ul>
            )}

            {userData.sites[userData.activeSite].requests && userData.sites[userData.activeSite].requests.length > 0 && (
                <ul><span className='header'>Requests</span>
                    {userData.sites[userData.activeSite].requests.map(user => {
                        return (
                            <div key={user}>
                                <li className={styles['list-item']}>
                                    <div className={styles.card}>
                                        <StatusLight isOnline={userData.associatedUsers[user].online} size='small' />
                                        <UserAvatar picturePath={userData.associatedUsers[user].picture} />
                                        <span>{userData.associatedUsers[user].name}</span>
                                    </div>
                                    <div>
                                        <button onClick={() => showInfo(user)}> info </button>
                                        <button onClick={() => acceptRequest(user)}>Add</button>
                                        <button onClick={() => rejectRequest(user)}>X</button>
                                    </div>
                                </li>
                                {userData.associatedUsers[user].info && <span>({userData.associatedUsers[user].username})</span>}
                            </div>
                        )
                    })}
                </ul>
            )}

        </div>
    )
}

export default PendingList
