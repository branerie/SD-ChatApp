import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const NotificationMenu = (props) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [groupName, setGroupName] = useState()

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

    // function showRequestInfo(site) {
    //     console.log(site)
    // }

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


    return (
        <div className={styles['menu']}>
            {
                userData.sites[userData.activeSite].requests && userData.sites[userData.activeSite].requests.length > 0 ?
                    <ul className={styles['header']} ><span>Requests:</span>
                        {userData.sites[userData.activeSite].requests.map(site => {
                            console.log(site.name);
                            return (
                                <li key={site._id}>
                                    <span>{site.username}</span>
                                    <div>
                                        <button onClick={() => acceptRequest(site)}>Accept</button>
                                        <button onClick={() => rejectRequest(site._id)}>Reject</button>
                                        {/* <span className="arrow down" onClick={() => showInvitationInfo(site._id)}></span> */}
                                    </div>
                                </li>
                            )
                        })}
                    </ul> : 
                    <div className={styles['header']}> You do not have any notifications </div>
            }

        </div>
    )
}

export default NotificationMenu
