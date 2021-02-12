import React, { useContext } from 'react'
import { MessagesContext } from '../../../../context/MessagesContext'
import styles from './index.module.css'

const StatusLight = ({ userId, size, isOnline }) => {
    const { userData } = useContext(MessagesContext)
    
    const color = isOnline
                    ? 'green'
                    : 'red'

    return (
        <div 
            className={`${styles.circle} ${styles[color]} ${styles[size]}`}
        />
    )
}

export default StatusLight
