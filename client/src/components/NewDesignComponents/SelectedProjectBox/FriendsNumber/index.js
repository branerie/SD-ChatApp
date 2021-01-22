import React, { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'

const FriendsNumber = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    if (!userData || !userData.activeSite) return null
    let members = userData.sites[userData.activeSite].groups[userData.activeGroup].members.sort((A, B) => {
        // default sort: alphabetical with online users on top and offline on bottom
        return userData.onlineMembers.includes(B._id) - userData.onlineMembers.includes(A._id) || A.username.localeCompare(B.username)
    })

    return (
        <div className={styles['friends']}>
            <div className={styles['friends-label']}>FRIENDS</div>
            <div className={styles['number']}>{members.length}</div> 
        </div>
    )
}

export default FriendsNumber
