import React, { useContext } from 'react'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatProjectPendingMembers = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function cancelInvitation(invitation) {
        socket.emit('cancel-invitation', { invitation, site: userData.activeSite }, () => {
            dispatchUserData({ type: 'cancel-invitation', payload: { invitation, site: userData.activeSite } })
        })
    }

    function showInvitationInfo(invitation) {
        console.log(invitation)
    }

    function acceptRequest(request) {
        socket.emit('accept-request', { request, site: userData.activeSite }, () => {
            dispatchUserData({ type: 'accept-request', payload: { request, site: userData.activeSite } })
        })
    }

    function rejectRequest(request) {
        socket.emit('reject-request', { request, site: userData.activeSite }, () => {
            dispatchUserData({ type: 'reject-request', payload: { request, site: userData.activeSite } })
        })
    }

    function showRequestInfo(request) {
        console.log(request)
    }

    return (
        <div>
            <h2>Pending</h2>
            {userData.sites[userData.activeSite].invitations && userData.sites[userData.activeSite].invitations.length > 0 && (
                <ul><span className='header'>Invitations</span>
                    {userData.sites[userData.activeSite].invitations.map(invitation => {
                        return (
                            <li key={invitation._id}>
                                <span>{invitation.username}</span>
                                <div>
                                    <button onClick={() => cancelInvitation(invitation)}>Cancel</button>
                                    <span className="arrow down" onClick={() => showInvitationInfo(invitation)}></span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {userData.sites[userData.activeSite].requests && userData.sites[userData.activeSite].requests.length > 0 && (
                <ul><span className='header'>Requests</span>
                    {userData.sites[userData.activeSite].requests.map(request => {
                        return (
                            <li key={request._id}>
                                <span>{request.username}</span>
                                <div>
                                    <button onClick={() => acceptRequest(request)}>Accept</button>
                                    <button onClick={() => rejectRequest(request)}>Reject</button>
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

export default ChatProjectPendingMembers
