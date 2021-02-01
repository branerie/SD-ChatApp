import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const AcceptMember = (props) => {
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
        <div className={styles['window']}>
             <h2>pending</h2>
            {userData.sites[userData.activeSite].requests && userData.sites[userData.activeSite].requests.length > 0 && (
                <ul><span className='header'>Requests</span>
                    {userData.sites[userData.activeSite].requests.map(site => {
                        console.log(site.name);
                        return (
                            <li key={site._id}>
                                <span>{site.username}</span>
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
        </div>
    )
}

export default AcceptMember
