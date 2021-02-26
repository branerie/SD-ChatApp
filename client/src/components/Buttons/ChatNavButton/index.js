import React from 'react'
import styles from './index.module.css'

const ChatNavButton = ({ onClick, title, icon}) => {
    return (
        <button
            className={styles.button}
            onClick={onClick}>
            <span>{title}</span>
            <i className='fas'>{icon}</i>
        </button>
    )
}

export default ChatNavButton