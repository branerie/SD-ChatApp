import React from 'react'
import styles from './index.module.css'
import settingIcon from '../../../../images/settings.svg'


const ProjectList = () => {
    
    return (
        <div className={styles['project-lsit']}>
            Project List
            <img src={settingIcon} alt="Settings Icon" className={styles['settings-icon']}   />
            
        </div>
    )
}

export default ProjectList
