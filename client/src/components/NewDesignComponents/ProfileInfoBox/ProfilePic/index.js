import React, { useContext } from 'react'
import styles from './index.module.css'
import emptyProfilePic from '../../../../images/emptyProfilePic.png'
import { getFullImageUrl } from '../../../../utils/image'

const ProfilePic = ({ picturePath }) => {
    return (
        <div className={styles.container}>
            <img 
                src={picturePath ? getFullImageUrl(picturePath) : emptyProfilePic} 
                className={styles.image} 
            /> 
        </div>  
    )
}

export default ProfilePic
