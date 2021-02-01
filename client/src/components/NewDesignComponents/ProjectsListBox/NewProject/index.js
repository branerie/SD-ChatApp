import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import newProjectButton from '../../../../images/newProjectButton.svg'
import settingsIconBig from '../../../../images/settingsIconBig.svg'
import joinProjectIcon from '../../../../images/joinProjectIcon.svg'
import { useHistory } from 'react-router-dom'
import AddProject from './AddProject'
import JoinProject from './JoinProject'
import TransparentBackground from '../../CommonComponents/TransparentBackground'
import SettingsPage from '../../../../pages/SettingsPage'

const NewProject = () => {
    const history = useHistory()
    const [backgroundOpened, setBackgroundOpened] = useState(false)
    const [settingPageOpened, setSettingPageOpened] = useState(false)
    const [addProjectOpened, setAddProjectOpened] = useState(false)
    const [joinProjectOpened, setJoinProjectOpened] = useState(false)
    
    const openAddProjectWindow = () => {
        setBackgroundOpened(true)
        setAddProjectOpened(true)
    }
    
    const openSettingsWindow = () => {
        setBackgroundOpened(true)
        setSettingPageOpened(true)
    }
    
    const openJoinProjectWindow = () => {
        setBackgroundOpened(true)
        setJoinProjectOpened(true)
    }
    
    const closeOpenedWindows = () => {
        setBackgroundOpened(false)
        setSettingPageOpened(false)
        setAddProjectOpened(false)
        setJoinProjectOpened(false)
    }

    return (
        <div>
            <div className={styles['box']}>
                <div className={styles['button']} onClick={openAddProjectWindow}>
                    <img src={newProjectButton} className={styles['img']}  />
                </div>
                <div className={styles['button']} onClick={openJoinProjectWindow}>
                    <img src={joinProjectIcon} className={styles['img']}  />
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
                {addProjectOpened ? <AddProject closeOpenedWindows={closeOpenedWindows} /> : <div />}
            </div>
            <div>
                {joinProjectOpened ? <JoinProject closeOpenedWindows={closeOpenedWindows} /> : <div />}
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
