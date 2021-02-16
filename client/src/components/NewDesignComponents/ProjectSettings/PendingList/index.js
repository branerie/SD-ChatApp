import { useContext } from 'react'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'
import Friend from '../../SelectedProjectBox/Friend'

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
            <h3>Pending</h3>
            {userData.sites[userData.activeSite].invitations && userData.sites[userData.activeSite].invitations.length > 0 && (
                <ul><span className='header'>Invitations</span>
                    {userData.sites[userData.activeSite].invitations.map(user => {
                        return (
                            <div key={user}>
                                <li>
                                    <Friend
                                        name={userData.associatedUsers[user].name}
                                        id={user}
                                        picturePath={userData.associatedUsers[user].picture}
                                        isOnline={userData.associatedUsers[user].online}
                                    />
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
                                <li>
                                    <Friend
                                        name={userData.associatedUsers[user].name}
                                        id={user}
                                        picturePath={userData.associatedUsers[user].picture}
                                        isOnline={userData.associatedUsers[user].online}
                                    />
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
