import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatProjectsPendingList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function acceptInvitation(site) {
        socket.emit('accept-invitation', site, (success, { siteData, onlineMembers }) => {
            if (success) {
                dispatchUserData({ type: 'invitation-accepted', payload: { siteData, onlineMembers, activeConnection: true } })
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

    return (
        <div>
            <h2>pending</h2>
            {userData.invitations && userData.invitations.length > 0 && (
                <ul><span className='header'>Invitations</span>
                    {userData.invitations.map(site => {
                        return (
                            <li key={site._id}>
                                <span>{site.name}</span>
                                <div>
                                    <button onClick={() => acceptInvitation(site._id)}>Accept</button>
                                    <button onClick={() => rejectInvitation(site._id)}>Reject</button>
                                    <span className="arrow down" onClick={() => showInvitationInfo(site._id)}></span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {userData.requests && userData.requests.length > 0 && (
                <ul><span className='header'>Requests</span>
                    {userData.requests.map(site => {
                        return (
                            <li key={site._id}>
                                <span>{site.name}</span>
                                <div>
                                    <button onClick={() => cancelRequest(site._id)}>Cancel</button>
                                    <span className="arrow down" onClick={() => showRequestInfo(site._id)}></span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default ChatProjectsPendingList
