import React from 'react'
import styles from './index.module.css'
import profPic from '../../../../../images/profPic.svg'

const ProfilePicture = () => {
    return (
            <img src={profPic} className={styles['profile-picture']} />
    )
}

export default ProfilePicture
