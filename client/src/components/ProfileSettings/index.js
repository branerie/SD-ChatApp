import React from 'react'
import styles from './index.module.css'
import PictureColumn from './PictureColumn'
import PersonalSettingsColumn from './PersonalSettingsColumn'


const ProfileSettings = () => {
    return (
        <div className={styles.menu}>
            <PictureColumn />
            <PersonalSettingsColumn />
        </div>
    )
}

export default ProfileSettings
