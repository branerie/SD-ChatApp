import styles from './index.module.css'
import { getFaceCroppedImageUrl } from '../../../utils/image'
import emptyProfilePic from '../../../images/emptyProfilePic.png'

const UserAvatar = ({ picturePath }) => {
    return (
        <div className={styles['avatar']}>
            <img
                alt=''
                src={picturePath ? getFaceCroppedImageUrl(picturePath) : emptyProfilePic}
                className={`${styles['profile-pic']} ${!picturePath && styles['pic-rounded']}`}
            />
        </div>
    )
}

export default UserAvatar