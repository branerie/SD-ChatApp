import styles from './index.module.css'
import { getFaceCroppedImageUrl } from '../../../utils/image'
import emptyProfilePic from '../../../images/profile-picture.png'
import StatusLight from '../StatusLight'


const UserAvatar = ({ picturePath, onlineStatus, isOnline }) => {
    return (
        <div className={styles.avatar}>
            <img
                alt='User Avatar'
                src={picturePath ? getFaceCroppedImageUrl(picturePath) : emptyProfilePic}
                className={styles.image}
            />
            {onlineStatus && <StatusLight isOnline={isOnline} size='small' />}
        </div>
    )
}

export default UserAvatar