import React, {useState, useEffect} from 'react'
import styles from './index.module.css'
import searchIcon from '../../../../../images/searchIcon.svg'
import moreIcon from '../../../../../images/moreIcon.svg'
import Input from '../../../CommonComponents/Input'
import closeButton from '../../../../../images/closeButton.svg'
import closeButtonHover from '../../../../../images/closeButtonHover.svg'
import {IsOpenedUseContext} from '../../../../../context/isOpened'
import FavIcon from './FavIcon'
import NotificationIcon from './NotificationIcon'
import CloseButton from './CloseButton'

const ChatTitle = (props) => {
    const [closeButtonSrc, setCloseButtonSrc] = useState(closeButton)
    const context = IsOpenedUseContext()
    
    return (
        <div className={styles['chat-title']}>
            <div>
                <FavIcon />
            </div>                
            <div className={styles['title']}>
                {props.title}
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
            <div>
                <CloseButton title={props.title} />
            </div>
        </div>
    )
}

export default ChatTitle
