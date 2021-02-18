import React from 'react'
import styles from './index.module.css'
import FriendsNumber from '../FriendsNumber'
import FriendsList from '../FriendsList'


const FriendsBox = () => {
    return (
        <div className={styles['friends-box']}>
            <FriendsNumber />
            <FriendsList />
        </div>
    )
}

export default FriendsBox
