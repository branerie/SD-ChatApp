import React from 'react'
import styles from './index.module.css'
import logoImage from '../../../../../images/logoSettingsPage.svg'

const Logo = () => {
    return (
        <img src={logoImage} className={styles['image']} />
    )
}

export default Logo
