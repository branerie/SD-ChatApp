import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import newProjectButton from '../../../../images/newProjectButton.svg'
import settingsIconBig from '../../../../images/settingsIconBig.svg'
import { useHistory } from 'react-router-dom'
import AddProject from './AddProject'
import TransparentBackground from '../../CommonComponents/TransparentBackground'

const NewProject = () => {
    const history = useHistory()
    const [backgroundShown, setBackgroundShown] = useState(false)

    return (
        <div>
            <div className={styles['box']}>
                <div className={styles['button']} onClick={() => {
                        setBackgroundShown(true)
                    }}>
                    <img src={newProjectButton} className={styles['img']}  />
                </div>
                <div className={styles['button']}>
                    <img src={settingsIconBig} className={styles['img']} />
                </div>
                <div>
                    <button onClick={() => { history.push('/chat') }}>Old Design</button>
                </div>
            </div>
            <div>
                {backgroundShown ? <AddProject /> : <div />}
            </div>
            <div>
                {backgroundShown ? <TransparentBackground setBackgroundShown={setBackgroundShown}/> : <div />}
            </div>
        </div>
    )
}

export default NewProject
