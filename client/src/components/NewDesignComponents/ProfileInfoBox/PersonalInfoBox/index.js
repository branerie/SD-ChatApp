import React from 'react'
import styles from './index.module.css'
import Info from './Info'


const PersonalInfoBox = () => {
    return (
        <div>
            <div className={styles['personal-info-box']}>
                <Info title='Username' text='ivaka' />
            </div>
            <div className={styles['personal-info-box']}>
                <Info title='Email' text='ivaka@gmail.com' />
            </div>
            <div className={styles['personal-info-box']}>
                <Info title='Skype' text='ivaka' />
            </div>
        </div>
    )
}

export default PersonalInfoBox
