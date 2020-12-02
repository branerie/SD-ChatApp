import React from 'react'
import styles from './index.module.css'
import newProjectButton from  '../../../../images/newProjectButton.svg'

const NewProject = () => {
    return (
        <div className={styles['box']}>
            <div className={styles['button']}>
                <img src={newProjectButton} className={styles['img']} />
            </div>
        </div>
    )
}

export default NewProject
