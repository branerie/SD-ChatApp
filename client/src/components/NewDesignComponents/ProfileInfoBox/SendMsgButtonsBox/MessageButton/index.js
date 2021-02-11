import React from 'react'
import styles from './index.module.css'

const MessageButton = () => {
    

    return (
            <input
                type='button' 
                className={styles['message-button']} 
                value='Message'
                onClick={()=>{console.log('AAA');}}
            />
    )
}

export default MessageButton
