import styles from './index.module.css'
import { getFaceCroppedImageUrl } from '../../../utils/image'
import emptyProfilePic from '../../../images/profile-picture.png'

const UserAvatar = ({ picturePath }) => {
    return (
        <div className={styles['avatar']}>
            <img
                alt='User Avatar'
                src={picturePath ? getFaceCroppedImageUrl(picturePath) : emptyProfilePic}
                className={`${styles['profile-pic']} ${!picturePath && styles['pic-rounded']}`}
            />
        </div>
    )
}

export default UserAvatar