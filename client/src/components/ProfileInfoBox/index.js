import { useContext, useEffect, useState } from 'react'
import { MessagesContext } from '../../context/MessagesContext'
import styles from './index.module.css'
import ProfilePic from './ProfilePic'
import Name from './NameAndPositionBox'
import SocialMediaBox from './SocialMediaBox'
import SendMsgButtonsBox from './SendMsgButtonsBox'
import PersonalInfoBox from './PersonalInfoBox'

import expandArrow from '../../images/arrowLeft.png'
import shrinkArrow from '../../images/arrowRight.png'
import { SocketContext } from '../../context/SocketContext'

const ProfileInfoBox = () => {
    const [userDetails, setUserDetails] = useState(null)
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    useEffect(() => {
        if (!userData.details) return

        socket.emit('get-user-details', userData.details.id, (details) => {
            setUserDetails(details)
        })
    }, [socket, userData.details])

    if (!userData.details || !userDetails) return null

    const isShown = userData.details && userData.details.isShown

    const toggleInfo = () => {
        userData.activeChat === userData.details.id 
            ? dispatchUserData({ type: 'toggle-details' })
            : dispatchUserData({ type: 'clear-details' })
    }

    return (
        <div className={styles.container}>
            <div className={styles['info-arrow']} onClick={toggleInfo}>
                <img 
                    src={isShown ? shrinkArrow : expandArrow} 
                    className={styles['arrow-img']} 
                    alt='Expand/collapse info column'
                />
            </div>
            { isShown &&
                <div className={styles['profile-info-box']}>
                    <ProfilePic picturePath={userDetails.picture} />
                    <div className={styles['text-container']}>
                        <Name 
                            isOnline={userData.associatedUsers[userData.details.id].online} 
                            name={userDetails.name} 
                            position={userDetails.position} 
                        />
                        <SocialMediaBox />
                        <SendMsgButtonsBox userId={userDetails.userId} name={userDetails.name} />
                        <PersonalInfoBox
                            username={userDetails.username}
                            email={userDetails.email}
                            company={userDetails.company}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfileInfoBox
