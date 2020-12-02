import React from 'react'
import styles from './index.module.css'

const StatusLight = (props) => {
    return (
        <div className={`${styles.circle} ${styles[props.color]} ${styles[props.size]}`} />
    )
}

export default StatusLight
