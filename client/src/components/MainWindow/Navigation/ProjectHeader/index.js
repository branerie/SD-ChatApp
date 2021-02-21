import { useContext } from 'react'
import styles from './index.module.css'
import { ReactComponent as Gear } from '../../../../images/settings.svg'
import { ReactComponent as BellEmpty } from '../../../../images/notificationProjectIcon.svg'
import { ReactComponent as BellFull } from '../../../../images/notificationIconFilled.svg'
import { MessagesContext } from '../../../../context/MessagesContext'

const ProjectHeader = () => {
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
        <div className={styles.container}>
            <div className={styles.icons}>
                {site.creator === userData.personal._id &&
                    <Gear className={styles.settings} onClick={projectSettings} />
                }
                {site.creator === userData.personal._id ?
                    site.requests && site.requests.length > 0 ?
                        <BellFull className={`${styles.notification} ${styles.full}`} /> :
                        <BellEmpty className={`${styles.notification} ${styles.empty}`} /> :
                    <div className={styles.info} onClick={showInfo}>i</div>
                }
            </div>
            <div className={styles.title}>{site.name}</div>
        </div>
    )
}

export default ProjectHeader
