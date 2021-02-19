import React from 'react'
import styles from './index.module.css'
import ProfilePicture from './ProfilePicture'
import SocialMedia from './SocialMedia'

const PictureColumn = () => {
    return (
        <div className={styles['logo-column']}>
            <ProfilePicture />
            <SocialMedia />
        </div>
    )
}

export default PictureColumn
