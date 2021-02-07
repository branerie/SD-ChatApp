import React from 'react'
import styles from './index.module.css'
import InputField from './InputField'
import facebook from '../../../../../images/socialMedia/facebook.svg'
import instagram from '../../../../../images/socialMedia/instagram.svg'
import linkedin from '../../../../../images/socialMedia/linkedin.svg'

const SocialMedia = () => {
    return (
        <div className={styles['social-media']}>
            <InputField socialMediaIcon={facebook} />
            <InputField socialMediaIcon={instagram} />
            <InputField socialMediaIcon={linkedin} />
        </div>
    )
}

export default SocialMedia
