import React, { useContext } from 'react'
import './index.css'
import { MessagesContext } from '../../context/MessagesContext'

const ChatProjectsPendingList = () => {
    const { userData } = useContext(MessagesContext)

    function acceptInvitation(invitation) {
        console.log(invitation)
    }

    function rejectInvitation(invitation) {
        console.log(invitation)
    }

    function showInvitationInfo(invitation) {
        console.log(invitation)
    }

    function cancelRequest(request) {
        console.log(request)
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
                                    <button onClick={() => acceptInvitation(invitation)}>Accept</button>
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
