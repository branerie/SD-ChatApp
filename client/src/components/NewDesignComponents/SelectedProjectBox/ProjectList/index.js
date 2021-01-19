import React, {useContext} from 'react'
import styles from './index.module.css'
import settingIcon from '../../../../images/settings.svg'
import { MessagesContext } from '../../../../context/MessagesContext'

const ProjectList = () => {
    const { userData } = useContext(MessagesContext)
    const site = userData.activeSite ? userData.sites[userData.activeSite].name : false

    return (
        <div className={styles['project-list']}>
            {site} 
            <img src={settingIcon} alt="Settings Icon" className={styles['settings-icon']}   />
        </div>
    )
}

export default ProjectList
