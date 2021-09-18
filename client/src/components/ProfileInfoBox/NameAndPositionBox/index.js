import React from 'react'
import styles from './index.module.css'
import StatusLight from '../../Common/StatusLight'

const Name = ({ isOnline, name, position }) => {
    return (
        <div className={styles['name-position-box']}>
            <div className={styles['name-box']}>
                <div className={styles['name']}>
                    {name}
                </div>
            </div>
            <div className={styles['position-box']}>
                {position && position}
            </div>
        </div>
    )
}

export default Name
