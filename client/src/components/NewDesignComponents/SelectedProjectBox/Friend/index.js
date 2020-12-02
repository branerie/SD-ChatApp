import React from 'react'
import styles from './index.module.css'
import StatusLight from '../../ProjectsListBox/StatusLight'
import Avatar from 'react-avatar'
import gero from '../../../../images/profilePics/g.jpg'

const Friend = () => {
    return (
        <div className={styles['friends']}>
            <div className={styles['status-light']}>
                <StatusLight color='red' size='small' />
            </div>
            <div className={styles['avatar']}>
                <Avatar size={32} scr={gero} round='5px'  />
            </div>
            <div className={styles['name']}>
                Gergan Ruschev
            </div>

        </div>
    )
}

export default Friend
