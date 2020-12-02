import React from 'react'
import styles from './index.module.css'
import Friend from '../Friend'

const FriendsList = () => {
    return (
        <div className={styles['friends-list']}>
            <Friend />
            <Friend />
            <Friend />
        </div>
    )
}

export default FriendsList
