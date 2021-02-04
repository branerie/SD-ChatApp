import React, { useContext } from 'react'
import styles from './index.module.css'
import InputField from './InputField'

import { MessagesContext } from '../../../../context/MessagesContext'

const PersonalSettingsColumn = () => {

    const { userData } = useContext(MessagesContext)

    function updateProfile(e) {
        e.preventDefault()
        console.log('test');
    }

    return (
        <div className={styles['personal-settings-container']}>
            <div className={styles['title']}>
                <u>Personal Settings</u>
            </div>
            <form className={styles['form']} onSubmit={(e) => updateProfile(e)}>
                <InputField value={userData.personal.name || ''} label={'Name'} />
                <InputField value={userData.personal.company || ''} label={'Company'} />
                <InputField value={userData.personal.position || ''} label={'Position'} />
                <InputField value={userData.personal.email || ''} label={'Email'} />
                <InputField value={userData.personal.mobile || ''} label={'Mobile'} />
                <button>Discard</button>
                <button>Save Changes</button>
            </form>
        </div>
    )
}

export default PersonalSettingsColumn
