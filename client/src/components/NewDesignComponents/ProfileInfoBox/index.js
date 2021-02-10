import React, { useContext, useEffect, useState } from 'react'
import styles from './index.module.css'
import ProfilePic from './ProfilePic'
import Name from './NameAndPositionBox'
import SocialMediaBox from './SocialMediaBox'
import SendMsgButtonsBox from './SendMsgButtonsBox'
import PersonalInfoBox from './PersonalInfoBox'
import { MessagesContext } from '../../../context/MessagesContext'

import expandArrow from '../../../images/arrowLeft.png'
import shrinkArrow from '../../../images/arrowRight.png'
import { SocketContext } from '../../../context/SocketContext'

const ProfileInfoBox = () => {
    const [isShown, setIsShown] = useState(false)
    const [userInChat, setUserInChat] = useState({})
    const { userData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    useEffect(() => {
        if (!userData.activeChat || !isShown) return

        if (userInChat.userId === userData.activeChat) return

        const getUserDetails = async (userId) => {
            socket.emit('get-user-details', userId, (success, userDetails) => {
                if (success) {
                    setUserInChat(userDetails)
                }
            })
        }

        getUserDetails(userData.activeChat)
    }, [userData.activeChat, isShown])

    if (!userData.activeChat) return null

    return (
        <div className={styles.container}>
            <div className={styles['info-arrow']} onClick={() => setIsShown(!isShown)}>
                <img src={isShown ? shrinkArrow : expandArrow} className={styles['arrow-img']} />
            </div>
            { isShown &&
                <div className={styles['profile-info-box']}>
                    <ProfilePic picturePath={userInChat.picture} />
                    <div className={styles['text-container']}>
                        <Name 
                            userId={userInChat.userId} 
                            name={userInChat.name} 
                            position={userInChat.position} 
                        />
                        <SocialMediaBox />
                        <SendMsgButtonsBox userId={userInChat.userId} name={userInChat.name} />
                        <PersonalInfoBox
                            username={userInChat.username}
                            email={userInChat.email}
                            company={userInChat.company}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfileInfoBox
