import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import settingIcon from '../../../../images/settings.svg'
import smallPlus from '../../../../images/smallPlus.svg'
import { MessagesContext } from '../../../../context/MessagesContext'
import TransparentBackground from '../../CommonComponents/TransparentBackground'
import AddGroup from './AddGroup'

const ProjectList = () => {
    const { userData } = useContext(MessagesContext)
    const site = userData.activeSite ? userData.sites[userData.activeSite].name : false
    const [backgroundShown, setBackgroundShown] = useState (false)

    return (
        <div className={styles['project-list']}>
            {site} 
            <img src={smallPlus} alt="Create Group" className={styles['plus-icon']} onClick={() => setBackgroundShown(true)} />
            <img src={settingIcon} alt="Settings Icon" className={styles['settings-icon']}   />
            <div>
                {backgroundShown ? <AddGroup /> : <div />}
            </div>
            <div>
                {backgroundShown ? <TransparentBackground setBackgroundShown={setBackgroundShown}/> : <div />}
            </div>
        </div>
    )
}

export default ProjectList
