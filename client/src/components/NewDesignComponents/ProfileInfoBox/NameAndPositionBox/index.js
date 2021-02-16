import React from 'react'
import styles from './index.module.css'
import StatusLight from '../../CommonComponents/StatusLight'

const Name = ({ isOnline, name, position }) => {
    return (
        <div className={styles['name-position-box']}>
            <div className={styles['name-box']}>
                <div className={styles['name']}>
                    {name}
                </div>
                <div className={styles['status-light']} >
                    <StatusLight
                        isOnline={isOnline}
                        size={'small'}
                    />
                </div>
            </div>
            <div className={styles['position-box']}>
                {position && position}
            </div>
        </div>
    )
}

export default Name
