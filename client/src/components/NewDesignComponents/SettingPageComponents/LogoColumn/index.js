import React from 'react'
import styles from './index.module.css'
import Logo from './Logo'
import ProfilePicture from './ProfilePicture'
import SocialMedia from './SocialMedia'

const LogoColumn = () => {
    return (
        <div className={styles['logo-column']}>
            <Logo  />    
            <ProfilePicture />
            <SocialMedia />
        </div>
    )
}

export default LogoColumn
