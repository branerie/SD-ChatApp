import { useContext, useMemo } from 'react'
import { MessagesContext } from '../../context/MessagesContext'
import styles from './index.module.css'
import ProfilePic from './ProfilePic'
import Name from './NameAndPositionBox'
import SocialMediaBox from './SocialMediaBox'
import SendMsgButtonsBox from './SendMsgButtonsBox'
import PersonalInfoBox from './PersonalInfoBox'

import expandArrow from '../../images/arrowLeft.png'
import shrinkArrow from '../../images/arrowRight.png'

const ProfileInfoBox = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    const [data, isShown] = useMemo(() => {
        if (userData.details && userData.details.id) {
            const userToShow = userData.associatedUsers[userData.details.id]
            return [userToShow, userData.details.isShown]
        }

        return [null, null]
    }, [userData.details, userData.associatedUsers])

    if (!data) return null

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
                    <ProfilePic picturePath={data.picture} />
                    <div className={styles['text-container']}>
                        <Name 
                            isOnline={data.online} 
                            name={data.name} 
                            position={data.position} 
                        />
                        <SocialMediaBox />
                        <SendMsgButtonsBox userId={data.userId} name={data.name} />
                        <PersonalInfoBox
                            username={data.username}
                            email={data.email}
                            company={data.company}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfileInfoBox
