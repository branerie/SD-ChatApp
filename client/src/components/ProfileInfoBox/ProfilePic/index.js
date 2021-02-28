import styles from './index.module.css'
import emptyProfilePic from '../../../images/profile-picture.png'
import { getFullImageUrl } from '../../../utils/image'

const ProfilePic = ({ picturePath }) => {
    return (
        <div className={styles.container}>
            <img
                alt=''
                src={picturePath ? getFullImageUrl(picturePath) : emptyProfilePic} 
                className={styles.image} 
            /> 
        </div>  
    )
}

export default ProfilePic
