import React, {useState}from 'react'
import styles from './index.module.css'
import favouriteStar from '../../../../../images/favouriteStar.svg'
import searchIcon from '../../../../../images/searchIcon.svg'
import notificationIcon from '../../../../../images/notificationIcon.svg'
import moreIcon from '../../../../../images/moreIcon.svg'
import Input from '../../../CommonComponents/Input'

const ChatTitle = () => {
    
    return (
        <div className={styles['chat-title']}>
            <div>
                <img src={favouriteStar} className={styles['fav-star']}/>
            </div>
            <div className={styles['title']}>
                Ship Design
            </div>
            <div className={styles['input-box']}>
                <Input placeholder='Search...'/>
               
                <img src={searchIcon} className={styles['search-icon']}/>
            </div>
            <div>
                <img src={notificationIcon} className={styles['notification-icon']}/>   
            </div>
            <div>
                <img src={moreIcon} className={styles['more-icon']}/>   
            </div>
        </div>
    )
}

export default ChatTitle
