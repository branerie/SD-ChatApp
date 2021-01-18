import React from 'react'
import styles from './index.module.css'
import newProjectButton from '../../../../images/newProjectButton.svg'
import settingsIconBig from '../../../../images/settingsIconBig.svg'
import { useHistory } from 'react-router-dom'

const NewProject = () => {
    const history = useHistory()
    return (
            <div className={styles['box']}>
                <div className={styles['button']}>
                    <img src={newProjectButton} className={styles['img']} />
                </div>
                <div className={styles['button']}>
                    <img src={settingsIconBig} className={styles['img']} onClick={()=>{}}/>
                </div>
                <div>
                    <button onClick={() => { history.push('/chat') }}>Old Design</button>
                </div>
            </div>
    )
}

export default NewProject
