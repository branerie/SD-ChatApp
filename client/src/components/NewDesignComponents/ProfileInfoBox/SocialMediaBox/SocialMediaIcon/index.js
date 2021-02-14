import React from 'react'
import styles from './index.module.css'

const SocialMediaIcon = (props) => {
    return (
        <div className={styles['social-media-icon']}>    
            <img src={props.source} className={styles['icon']} alt=''/>    
        </div>
    )
}

export default SocialMediaIcon
