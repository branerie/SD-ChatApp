import React, { useState } from 'react'
import styles from './index.module.css'
import settingsIconBig from '../../../../images/settingsIconBig.svg'
import TransparentBackground from '../../CommonComponents/TransparentBackground'
import SettingsPage from '../../../../pages/SettingsPage'

const NewProject = () => {
    const [backgroundOpened, setBackgroundOpened] = useState(false)
    const [settingPageOpened, setSettingPageOpened] = useState(false)
    
    const openSettingsWindow = () => {
        setBackgroundOpened(true)
        setSettingPageOpened(true)
    }
    
     const closeOpenedWindows = () => {
        setBackgroundOpened(false)
        setSettingPageOpened(false)
    }

    return (
        <div>
            <div className={styles['box']}>
                <div className={styles['button']} onClick={openSettingsWindow}>
                    <img src={settingsIconBig} className={styles['img']} />
                </div>
                <div>
                </div>
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
