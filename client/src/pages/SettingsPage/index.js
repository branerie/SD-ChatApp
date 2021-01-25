import React from 'react'
import styles from './index.module.css'
import LogoColumn from '../../components/NewDesignComponents/SettingPageComponents/LogoColumn'
import PersonalSettingsColumn from '../../components/NewDesignComponents/SettingPageComponents/PersonalSettingsColumn'


const SettingsPage = () => {
    return (
        <div className={styles['setting-page']}>
            <LogoColumn />
            <PersonalSettingsColumn />
        </div>
    )
}

export default SettingsPage
