import React from 'react'
import styles from './index.module.css'
import ProfilePic from './ProfilePic'
import Name from './NameAndPositionBox'
import SocialMediaBox from './SocialMediaBox'
import SendMsgButtonsBox from './SendMsgButtonsBox'
import PersonalInfoBox from './PersonalInfoBox'

const ProfileInfoBox = () => {
    return (
        <div className={styles['profile-info-box']}>
            <ProfilePic />
            <Name />
            <SocialMediaBox />
            <SendMsgButtonsBox />
            <PersonalInfoBox />
        </div>
    )
}

export default ProfileInfoBox
