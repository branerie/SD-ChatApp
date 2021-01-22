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
    console.log(userData);
    const [backgroundShown, setBackgroundShown] = useState(false)
    if (!userData || !userData.sites[userData.activeSite]) return null //<div>Loading...</div>

    return (
        <div className={styles['project-list']}>
            {site}
            <div className={styles['small-icons']}>
                {userData.sites[userData.activeSite].creator === userData.personal._id ? <img src={smallPlus} alt="Create Group" className={styles['plus-icon']} onClick={() => setBackgroundShown(true)} /> : <div></div>}
                <img src={settingIcon} alt="Settings Icon" className={styles['settings-icon']} />
            </div>
            <div>
                {backgroundShown ? <AddGroup /> : <div />}
            </div>
            <div>
                {backgroundShown ? <TransparentBackground setBackgroundShown={setBackgroundShown} /> : <div />}
            </div>
        </div>
    )
}

export default ProjectList
