import React from 'react'
import styles from './index.module.css'

const ChatNavButton = ({ onClick, title }) => {
    return (
        <button className={styles.button} onClick={onClick}>{title}</button>
    )
}

export default ChatNavButton