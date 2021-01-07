import React, {useState}from 'react'
import styles from './index.module.css'
import searchIcon from '../../../../../images/searchIcon.svg'

import moreIcon from '../../../../../images/moreIcon.svg'
import Input from '../../../CommonComponents/Input'
<<<<<<< Updated upstream

const ChatTitle = () => {
=======


import FavIcon from './FavIcon'
import NotificationIcon from './NotificationIcon'
import CloseButton from './CloseButton'

const ChatTitle = (props) => {
    
>>>>>>> Stashed changes
    
    return (
        <div className={styles['chat-title']}>
            <div>
                <FavIcon />
            </div>                
            <div className={styles['title']}>
                Ship Design
            </div>
            <div className={styles['input-box']}>
                <Input placeholder='Search...' />
                <img src={searchIcon} className={styles['search-icon']} />
            </div>
            <div>
                <NotificationIcon />
            </div>
            <div>
                <img src={moreIcon} className={styles['more-icon']} />
            </div>
<<<<<<< Updated upstream
=======
            <div>
                <CloseButton title={props.title} />
            </div>
>>>>>>> Stashed changes
        </div>
    )
}

export default ChatTitle
