import React from 'react'
import styles from './index.module.css'
import LogoColumn from './LogoColumn'
import PersonalSettingsColumn from './PersonalSettingsColumn'


const ProfileSettings = () => {
    return (
        <div className={styles['setting-page']}>
            <LogoColumn />
            <PersonalSettingsColumn />
        </div>
    )
}

export default ProfileSettings
