import React from 'react'
import styles from './index.module.css'
import twitter from '../../../../images/socialMedia/twitter.svg'
import facebook from '../../../../images/socialMedia/facebook.svg'
import instagram from '../../../../images/socialMedia/instagram.svg'
import linkedin from '../../../../images/socialMedia/linkedin.svg'
import SocialMediaIcon from './SocialMediaIcon'

const SocialMediaBox = () => {
    return (
        <div className={styles['social-media-box']}>
            <SocialMediaIcon source={facebook}/>
            <SocialMediaIcon source={twitter}/>
            <SocialMediaIcon source={instagram}/>
            <SocialMediaIcon source={linkedin}/>
        </div>
    )
}

export default SocialMediaBox
