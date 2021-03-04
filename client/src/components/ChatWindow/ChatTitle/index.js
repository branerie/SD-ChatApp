import styles from './index.module.css'
import searchIcon from '../../../icons/search.svg'
import moreIcon from '../../../icons/options.svg'
import Input from '../../Common/Input'
import FavIcon from './FavIcon'
import NotificationIcon from './NotificationIcon'
import CloseButton from './CloseButton'
import SeparatingLine from '../../SeparatingLine'

const ChatTitle = ({ title, privChat }) => {

    return (
        <>
            <div className={styles.container}>
                <div className={styles.inner}>
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
                    <div className={`${styles.notification} ${styles.icon}`}>
                        <NotificationIcon />
                    </div>
                    <div className={styles.icon}>
                        <img src={moreIcon} className={styles.more} alt='' />
                    </div>
                </div>
                {privChat &&
                    <div className={styles.close}>
                        <CloseButton chat={privChat} />
                    </div>
                }
            </div>
            <SeparatingLine horizontal={true} />
        </>
    )
}

export default ChatTitle
