import styles from './index.module.css'
import { getRoundedImageUrl } from '../../../utils/image'
import noLogo from '../../../images/no-logo.png'

const ProjectAvatar = ({ picturePath }) => {
    return (
        <div className={styles['avatar']}>
            <img
                alt='Project logo avatar'
                src={picturePath ? getRoundedImageUrl(picturePath) : noLogo}
                className={`${styles['profile-pic']} ${!picturePath && styles['pic-rounded']}`}
            />
        </div>
    )
}

export default ProjectAvatar