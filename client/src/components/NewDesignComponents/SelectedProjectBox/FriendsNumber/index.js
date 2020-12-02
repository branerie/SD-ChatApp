import React from 'react'
import styles from './index.module.css'

const FriendsNumber = () => {
    return (
        <div className={styles['friends']}>
            <div className={styles['friends-label']}>FRIENDS</div>
            <div className={styles['number']}>82</div> 
        </div>
    )
}

export default FriendsNumber
