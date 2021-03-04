import React from 'react'
import styles from './index.module.css'
import ProfilePicture from './ProfilePicture'
import SocialMedia from './SocialMedia'
import ThemeSelect from './ThemeSelect'
import MenuButton from '../../Buttons/MenuButton'
import { AuthenticateUser } from '../../../context/AuthenticationContext'

const PictureColumn = () => {
    const { logOut } = AuthenticateUser()
    return (
        <div className={styles['logo-column']}>
            <ProfilePicture />
            {/* <SocialMedia /> */}
            <ThemeSelect />
            <MenuButton title='Logout' onClick={logOut} btnSize='full' />
        </div>
    )
}

export default PictureColumn
