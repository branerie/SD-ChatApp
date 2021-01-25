import React from 'react'
import styles from './index.module.css'
import InputField from './InputField'

const PersonalSettingsColumn = () => {
    return (
        <div className={styles['personal-settings-container']}>
            <div className={styles['title']}>
                <u>Personal Settings</u>
            </div>
            <form className={styles['form']}>
                <InputField label={'Name'} />
                <InputField label={'Username'} />
                <InputField label={'Position'} />
                <InputField label={'Company'} />
                <InputField label={'Email'} />
                <InputField label={'Mobile'} />
            </form>
        </div>
    )
}

export default PersonalSettingsColumn
