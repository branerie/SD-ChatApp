import React, { useContext } from 'react'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatProjectPendingMembers = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    function cancelInvitation(user) {
        socket.emit('cancel-invitation', { user, site: userData.activeSite }, () => {
            // dispatchUserData({ type: 'cancel-invitation', payload: { invitation, site: userData.activeSite } })
        })
    }

    function showInvitationInfo(user) {
        console.log(user)
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

    function showRequestInfo(user) {
        console.log(user)
    }

    return (
        <div>
            <h2>Pending</h2>
            {userData.sites[userData.activeSite].invitations && userData.sites[userData.activeSite].invitations.length > 0 && (
                <ul><span className='header'>Invitations</span>
                    {userData.sites[userData.activeSite].invitations.map(user => {
                        return (
                            <li key={user._id}>
                                <span>{user.username}</span>
                                <div>
                                    <button onClick={() => cancelInvitation(user._id)}>Cancel</button>
                                    <span className="arrow down" onClick={() => showInvitationInfo(user._id)}></span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {userData.sites[userData.activeSite].requests && userData.sites[userData.activeSite].requests.length > 0 && (
                <ul><span className='header'>Requests</span>
                    {userData.sites[userData.activeSite].requests.map(user => {
                        return (
                            <li key={user._id}>
                                <span>{user.username}</span>
                                <div>
                                    <button onClick={() => acceptRequest(user)}>Accept</button>
                                    <button onClick={() => rejectRequest(user._id)}>Reject</button>
                                    <span className="arrow down" onClick={() => showRequestInfo(user._id)}></span>
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
