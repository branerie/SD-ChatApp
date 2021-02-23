import React from 'react'
import styles from './index.module.css'
import ProfilePicture from './ProfilePicture'
import SocialMedia from './SocialMedia'
import ThemeSelect from './ThemeSelect'

const PictureColumn = () => {
    return (
        <div className={styles['logo-column']}>
            <ProfilePicture />
            {/* <SocialMedia /> */}
            <ThemeSelect />
        </div>
    )
}

export default PictureColumn
