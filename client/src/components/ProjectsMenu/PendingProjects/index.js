import { useContext } from 'react'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import styles from './index.module.css'


const PendingProjects = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function acceptInvitation(site) {
        socket.emit('accept-invitation', site, (success, { siteData, associatedUsers, onlineMembers }) => {
            if (success) {
                dispatchUserData({ type: 'invitation-accepted', payload: { siteData, associatedUsers, onlineMembers, activeConnection: true } })
            }
        })
    }

    function rejectInvitation(site) {
        socket.emit('reject-invitation', site, () => {
            // dispatchUserData({ type: 'reject-invitation', payload: { invitation } })
        })
    }

    function showInvitationInfo(site) {
        console.log(site)
    }

    function cancelRequest(site) {
        socket.emit('cancel-request', site, () => {
            // dispatchUserData({ type: 'cancel-request', payload: { request } })
        })
    }

    function showRequestInfo(site) {
        console.log(site)
    }

    // if (!userData.invitations && !userData.requests) return null

    return (
        <div className={styles['menu-field']}>
            {userData.invitations && userData.invitations.length > 0 && (
                <div>
                    <h3>Invitations</h3>
                    <small>A list of projects you have been invited to join</small><br />
                    <small>You must accept invitation to become part of the project</small>
                    <ul>
                        {userData.invitations.map(site => {
                            return (
                                <li key={site._id}>
                                    <span>{site.name}</span>
                                    <div>
                                        <button onClick={() => acceptInvitation(site._id)}>Accept</button>
                                        <button onClick={() => rejectInvitation(site._id)}>Reject</button>
                                        <button onClick={() => showInvitationInfo(site._id)}>Info</button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

            {userData.requests && userData.requests.length > 0 && (
                <div>
                    <h3>Requests</h3>
                    <small>A list of projects you have sent request to join</small><br />
                    <small>Project administator must accept your request to become a member</small>
                    <ul>
                        {userData.requests.map(site => {
                            return (
                                <li key={site._id}>
                                    <span>{site.name}</span>
                                    <div>
                                        <button onClick={() => cancelRequest(site._id)}>Cancel</button>
                                        <button onClick={() => showRequestInfo(site._id)}>Info</button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default PendingProjects
