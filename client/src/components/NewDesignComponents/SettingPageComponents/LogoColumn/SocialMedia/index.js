import React from 'react'
import styles from './index.module.css'
import InputField from './InputField'
import facebookIcon from '../../../../../images/socialMedia/fbIcon.svg'
import instagramIcon from '../../../../../images/socialMedia/instagramIcon.svg'
import linkedinIcon from '../../../../../images/socialMedia/linkedinIcon.svg'

const SocialMedia = () => {
    return (
        <div className={styles['social-media']}>
            <InputField socialMediaIcon={facebookIcon} />
            <InputField socialMediaIcon={instagramIcon} />
            <InputField socialMediaIcon={linkedinIcon} />

        </div>
        )
}

export default SocialMedia
