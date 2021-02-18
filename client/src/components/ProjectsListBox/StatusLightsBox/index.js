import React from 'react'
import styles from './index.module.css'
import StatusLight from '../../CommonComponents/StatusLight'

const StatusLightsBox = () => {
    return (
        <div className={styles['status-lights-box']}>
            <StatusLight color='red' size='large' />
            <StatusLight color='yellow' size='large' />
            <StatusLight color='green' size='large' />
        </div>
    )
}

export default StatusLightsBox
