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

    function showInfo(invitation) {
        console.log(invitation)
    }

    return (
        <div>
            <h2>pending</h2>
            <ul>
                {userData.invitations.map(invitation => {
                    return (
                        <li key={invitation._id}>
                            <span>{invitation.name}</span>
                            <div>
                                <button onClick={() => acceptInvitation(invitation)}>Accept</button>
                                <button onClick={() => rejectInvitation(invitation)}>Reject</button>
                                <span className="arrow down" onClick={() => showInfo(invitation)}></span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ChatProjectsPendingList
