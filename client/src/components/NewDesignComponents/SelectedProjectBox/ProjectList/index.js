import { useContext } from 'react'
import styles from './index.module.css'
import settingIcon from '../../../../images/settings.svg'
import notificationProjectIcon from '../../../../images/notificationProjectIcon.svg'
import notificationIconFilled from '../../../../images/notificationIconFilled.svg'
import { MessagesContext } from '../../../../context/MessagesContext'

const ProjectList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    if (!userData || !userData.sites[userData.activeSite]) return null //<div>Loading...</div>
    
    function projectSettings() {
        dispatchUserData({ type: 'load-project-settings', payload: {} })
    }
    
    function showInfo() { //todo
        console.log(userData.activeSite)
    }

    const site = userData.sites[userData.activeSite]
    return (
        <div className={styles['project-list']}>
            {site.name}
            <div className={styles['small-icons']}>
                {site.creator === userData.personal._id ? 
                    site.requests && site.requests.length > 0 ?
                    <img src={notificationIconFilled} alt='Notification' className={styles['plus-icon']} /> :
                    <img src={notificationProjectIcon} alt='Notification' className={styles['plus-icon']} /> : 
                    <div className={styles.info} onClick={showInfo}>i</div>
                }
                {site.creator === userData.personal._id &&
                    <img
                        src={settingIcon}
                        alt='Settings Icon'
                        className={styles['settings-icon']}
                        onClick={projectSettings}
                    />
                }
            </div>
        </div>
    )
}

export default ProjectList
