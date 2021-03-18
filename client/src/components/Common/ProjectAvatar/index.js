import css from './index.module.css'
import { getRoundedImageUrl } from '../../../utils/image'
import noLogo from '../../../images/no-logo.png'

const ProjectAvatar = ({ picturePath }) => {
    return (
        <div className={css.container}>
            <img
                alt='Project logo avatar'
                src={picturePath ? getRoundedImageUrl(picturePath) : noLogo}
                className={css.logo}
            />
        </div>
    )
}

export default ProjectAvatar