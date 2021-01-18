import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatProjectsPendingList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function acceptInvitation(invitation) {
        socket.emit('accept-invitation', invitation, (success, { siteData, onlineMembers }) => {
            if (success) {
                dispatchUserData({ type: 'accept-invitation', payload: { siteData, onlineMembers, activeConnection: true } })
            }
        })
    }

    function rejectInvitation(invitation) {
        socket.emit('reject-invitation', invitation, () => {
            dispatchUserData({ type: 'reject-invitation', payload: { invitation } })
        })
    }

    function showInvitationInfo(invitation) {
        console.log(invitation)
    }

    function cancelRequest(request) {
        socket.emit('cancel-request', request, () => {
            dispatchUserData({ type: 'cancel-request', payload: { request } })
        })
    }

    function showRequestInfo(request) {
        console.log(request)
    }

    return (
        <div>
            <h2>pending</h2>
            {userData.invitations && userData.invitations.length > 0 && (
                <ul><span className='header'>Invitations</span>
                    {userData.invitations.map(invitation => {
                        return (
                            <li key={invitation._id}>
                                <span>{invitation.name}</span>
                                <div>
                                    <button onClick={() => acceptInvitation(invitation._id)}>Accept</button>
                                    <button onClick={() => rejectInvitation(invitation)}>Reject</button>
                                    <span className="arrow down" onClick={() => showInvitationInfo(invitation)}></span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {userData.requests && userData.requests.length > 0 && (
                <ul><span className='header'>Requests</span>
                    {userData.requests.map(request => {
                        return (
                            <li key={request._id}>
                                <span>{request.name}</span>
                                <div>
                                    <button onClick={() => cancelRequest(request)}>Cancel</button>
                                    <span className="arrow down" onClick={() => showRequestInfo(request)}></span>
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
