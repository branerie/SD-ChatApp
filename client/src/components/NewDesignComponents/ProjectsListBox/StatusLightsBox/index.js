import React from 'react'
import styles from './index.module.css'
import StatusLight from '../StatusLight'

const StatusLightsBox = () => {
    return (
        <div className={styles['status-lights-box']}>
            <StatusLight color='red' />
            <StatusLight color='yellow' />
            <StatusLight color='green' />
        </div>
    )
}

export default StatusLightsBox
