import styles from './index.module.css'
import SmallButton from '../../Buttons/SmallButton'
import { useContext } from 'react'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'


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
        <div>
            {userData.invitations && userData.invitations.length > 0 && (
                <div>
                    <h3>Invitations</h3>
                    <small>A list of projects you have been invited to join</small><br />
                    <small>You must accept invitation to become part of the project</small>
                    <ul>
                        {userData.invitations.map(site => {
                            return (
                                <li className={styles.row} key={site._id}>
                                    <span>{site.name}</span>
                                    <div>
                                        <SmallButton onClick={() => acceptInvitation(site._id)} title='Accept' />
                                        <SmallButton onClick={() => rejectInvitation(site._id)} title='Reject' />
                                        <SmallButton onClick={() => showInvitationInfo(site._id)} title='Info' />
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
                                <li className={styles.row} key={site._id}>
                                    <span>{site.name}</span>
                                    <div>
                                        <SmallButton onClick={() => cancelRequest(site._id)} title='Cancel' />
                                        <SmallButton onClick={() => showRequestInfo(site._id)} title='Info' />
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
