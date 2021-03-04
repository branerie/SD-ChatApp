import { useContext } from 'react'
import styles from './index.module.css'
import { ReactComponent as Gear } from '../../../icons/gear.svg'
import { ReactComponent as Info } from '../../../icons/info.svg'
import { ReactComponent as BellEmpty } from '../../../icons/bell-empty.svg'
import { ReactComponent as BellFull } from '../../../icons/bell-full.svg'
import { MessagesContext } from '../../../context/MessagesContext'

const ProjectHeader = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function projectSettings() {
        dispatchUserData({ type: 'load-project-settings', payload: {} })
    }

    function showInfo() { //todo
        console.log(userData.activeSite)
    }

    const site = userData.sites[userData.activeSite]
    return (
        <div className={styles.container}>
            {userData.device !== 'mobile' &&
                <div className={styles.icons}>
                    {site.creator === userData.personal._id &&
                        <Gear className={styles.settings} onClick={projectSettings} />
                    }
                    {site.creator === userData.personal._id
                        ? site.requests && site.requests.length > 0
                            ? <BellFull className={`${styles.notification} ${styles.full}`} />
                            : <BellEmpty className={`${styles.notification} ${styles.empty}`} />
                        : <Info className={styles.info} onClick={showInfo} />
                    }
                </div>
            }
            <div className={styles.title}>{site.name}</div>
        </div>
    )
}

export default ProjectHeader
