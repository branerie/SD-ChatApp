import React from 'react'
import styles from './index.module.css'
import StatusLight from '../../CommonComponents/StatusLight'
import Avatar from 'react-avatar'

const Friend = (props) => {
    return (
        <div className={styles['friends']}>
            <div className={styles['status-light']}>
                <StatusLight color='red' size='small' />
            </div>
            <div className={styles['avatar']}>
                <Avatar size={32} round='5px'  />
            </div>
            <div className={styles['name']}>
                {props.name}
            </div>

        </div>
    )
}

export default Friend
