import styles from './index.module.css'
import searchIcon from '../../../../images/searchIcon.svg'
import moreIcon from '../../../../images/moreIcon.svg'
import Input from '../../../Common/Input'
import FavIcon from './FavIcon'
import NotificationIcon from './NotificationIcon'
import CloseButton from './CloseButton'

const ChatTitle = ({ title, privChat }) => {

    return (
        <div className={styles.container}>
            <div>
                <FavIcon />
            </div>
            <div className={styles.title}>
                {title}
            </div>
            <div className={styles['input-box']}>
                <Input placeholder='Search...' />
                <img src={searchIcon} className={styles['search-icon']} alt='' />
            </div>
            <div>
                <NotificationIcon />
            </div>
            <div>
                <img src={moreIcon} className={styles.more} alt='' />
            </div>
            { privChat &&
                <div>
                    <CloseButton chat={privChat} />
                </div>
            }
        </div>
    )
}

export default ChatTitle
