import React, {useState, useEffect} from 'react'
import styles from './index.module.css'
import newProjectButton from '../../../../images/newProjectButton.svg'
import settingsIconBig from '../../../../images/settingsIconBig.svg'
import { useHistory } from 'react-router-dom'
import EnterProjectName from './EnterProjectName'

const NewProject = () => {
    const history = useHistory()
    const [flag, setFlag] = useState (false)

    return (
        <div>
            <div className={styles['box']}>
                <div className={styles['button']}>
                    <img src={newProjectButton} className={styles['img']} onClick={() => setFlag(true)} />
                </div>
                <div className={styles['button']} >
                    <img src={settingsIconBig} className={styles['img']} />
                </div>
                <div>
                    <button onClick={() => { history.push('/chat') }}>Old Design</button>
                </div>
                <div>
                </div>
            </div>
            {flag ? <EnterProjectName /> : <div></div> }
        </div>
    )
}

export default NewProject
