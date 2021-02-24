import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import StatusLight from '../../Common/StatusLight'
import UserAvatar from '../../Common/UserAvatar'
import MenuButton from '../../Buttons/MenuButton'

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

    const hasInvitations = userData.sites[userData.activeSite].invitations && 
                           userData.sites[userData.activeSite].invitations.length > 0

    return (
        <div className={styles.pending}>
            <p>Pending</p>
            {hasInvitations && (
                <ul><span>Invitations</span>
                    {userData.sites[userData.activeSite].invitations.map(user => {
                        return (
                            <div key={user} className={styles.row}>
                                <li className={styles['list-item']}>
                                    <div className={styles.card}>
                                        {/* <StatusLight isOnline={userData.associatedUsers[user].online} size='small' /> */}
                                        <UserAvatar picturePath={userData.associatedUsers[user].picture} />
                                        <span className={styles.name}>{userData.associatedUsers[user].name}</span>
                                    </div>
                                    <div className={styles.buttons}>
                                        <MenuButton 
                                            onClick={() => showInfo(user)} 
                                            title='Info'
                                            btnSize='small'
                                        />
                                        <MenuButton 
                                            onClick={() => cancelInvitation(user)} 
                                            title='Cancel'
                                            btnType='cancel'
                                            btnSize='medium'
                                            style={{ marginLeft: '0.5rem' }} 
                                        />
                                    </div>
                                </li>
                                {userData.associatedUsers[user].info &&
                                    <span className={styles.info}>
                                        ({userData.associatedUsers[user].username})
                                    </span>
                                }
                            </div>
                        )
                    })}
                </ul>
            )}

            {userData.sites[userData.activeSite].requests && userData.sites[userData.activeSite].requests.length > 0 && (
                <ul><span>Requests</span>
                    {userData.sites[userData.activeSite].requests.map(user => {
                        return (
                            <div key={user} className={styles.row}>
                                <li className={styles['list-item']}>
                                    <div className={styles.card}>
                                        {/* <StatusLight isOnline={userData.associatedUsers[user].online} size='small' /> */}
                                        <UserAvatar picturePath={userData.associatedUsers[user].picture} />
                                        <span className={styles.name}>{userData.associatedUsers[user].name}</span>
                                    </div>
                                    <div className={styles.buttons}>
                                        <MenuButton 
                                            onClick={() => acceptRequest(user)} 
                                            title='Accept'
                                            btnType='submit'
                                            btnSize='medium'
                                        />
                                        <MenuButton 
                                            onClick={() => rejectRequest(user)} 
                                            title='Reject'
                                            btnType='cancel'
                                            btnSize='medium'
                                            style={{ marginLeft: '0.5rem' }} 
                                        />
                                        <MenuButton 
                                            onClick={() => showInfo(user)} 
                                            title='Info' 
                                            btnSize='medium'
                                            style={{ marginLeft: '0.5rem' }}
                                        />
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
