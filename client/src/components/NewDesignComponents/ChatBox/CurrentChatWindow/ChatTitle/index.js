import React, {useState, useEffect}from 'react'
import styles from './index.module.css'
import favouriteStar from '../../../../../images/favouriteStar.svg'
import searchIcon from '../../../../../images/searchIcon.svg'
import notificationIcon from '../../../../../images/notificationIcon.svg'
import moreIcon from '../../../../../images/moreIcon.svg'
import Input from '../../../CommonComponents/Input'
import closeButton from '../../../../../images/closeButton.svg'
import closeButtonHover from '../../../../../images/closeButtonHover.svg'
import {IsOpenedUseContext} from '../../../../../context/isOpened'

const ChatTitle = (props) => {
    const [closeButtonSrc, setCloseButtonSrc] = useState(closeButton)
    const context = IsOpenedUseContext()
    
    return (
        <div className={styles['chat-title']}>
            <div>
                <img src={favouriteStar} className={styles['fav-star']}/>
            </div>
            <div className={styles['title']}>
                {props.title}
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
            <div className={styles['close-button']}>
                <img 
                    src={closeButtonSrc}
                    onMouseEnter={()=>{setCloseButtonSrc(closeButtonHover)}}
                    onMouseOut ={()=>{setCloseButtonSrc(closeButton)}}
                    onClick={() => {
                        console.log(context.openedTreads)
                        context.openedTreads[props.title] = false
                    }} 
                />   
            </div>
        </div>
    )
}

export default ChatTitle
