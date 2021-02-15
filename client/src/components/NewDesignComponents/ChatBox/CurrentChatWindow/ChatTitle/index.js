import React, {useRef, useEffect, useContext} from 'react'
import styles from './index.module.css'
import searchIcon from '../../../../../images/searchIcon.svg'
import moreIcon from '../../../../../images/moreIcon.svg'
import Input from '../../../CommonComponents/Input'
import FavIcon from './FavIcon'
import NotificationIcon from './NotificationIcon'
import CloseButton from './CloseButton'
import { MessagesContext } from "../../../../../context/MessagesContext";

const ChatTitle = (props) => {
    const { userData } = useContext(MessagesContext)
    const prevActive = useRef()

    useEffect(() => {
        let { activeSite, activeGroup, activeChat } = userData
        prevActive.current = { activeSite, activeGroup, activeChat }
    })  //TODO: useEffect to check for dependency

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
                <img src={searchIcon} className={styles['search-icon']} alt= ''/>
            </div>
            <div>
                <NotificationIcon />
            </div>
            <div>
                <img src={moreIcon} className={styles['more-icon']} alt=''/>
            </div>
            { userData.activeChat && 
            <div>
                <CloseButton chat={userData.activeChat} prevActive={prevActive.current}/>
            </div>
            }
        </div>
    )
}

export default ChatTitle
