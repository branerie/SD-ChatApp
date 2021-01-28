import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import newProjectButton from '../../../../images/newProjectButton.svg'
import settingsIconBig from '../../../../images/settingsIconBig.svg'
import { useHistory } from 'react-router-dom'
import AddProject from './AddProject'
import TransparentBackground from '../../CommonComponents/TransparentBackground'
import SettingsPage from '../../../../pages/SettingsPage'

const NewProject = () => {
    const history = useHistory()
    const [backgroundOpened, setBackgroundOpened] = useState(false)
    const [settingPageOpened, setSettingPageOpened] = useState(false)
    const [addProjectOpened, setAddProjectOpened] = useState(false)
    
    const openAddProjectWindow = () => {
        setBackgroundOpened(true)
        setAddProjectOpened(true)
    }
    
    const openSettingsWindow = () => {
        setBackgroundOpened(true)
        setSettingPageOpened(true)
    }
    
    const closeOpenedWindows = () => {
        setBackgroundOpened(false)
        setSettingPageOpened(false)
        setAddProjectOpened(false)
    }

    return (
        <div>
            <div className={styles['box']}>
                <div className={styles['button']} onClick={openAddProjectWindow}>
                    <img src={newProjectButton} className={styles['img']}  />
                </div>
                <div className={styles['button']} onClick={openSettingsWindow}>
                    <img src={settingsIconBig} className={styles['img']} />
                </div>
                <div>
                    <button onClick={() => { history.push('/chat') }}>Old Design</button>
                </div>
                <div>
                </div>
            </div>
            <div>
                {addProjectOpened ? <AddProject /> : <div />}
            </div>
            <div>
                {backgroundOpened ? <TransparentBackground closeOpenedWindows={closeOpenedWindows}/> : <div />}
            </div>
            <div >
                {settingPageOpened ? <SettingsPage /> : <></>}
            </div>
        </div>
    )
}

export default NewProject
