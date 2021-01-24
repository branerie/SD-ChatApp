import React from 'react'
import styles from './index.module.css'
import LogoColumn from '../../components/NewDesignComponents/SettingPageComponents/LogoColumn'


const SettingsPage = () => {
    return (
        <div className={styles['setting-page']}>
            <LogoColumn />
        </div>
    )
}

export default SettingsPage
