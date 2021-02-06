import React, { useContext, useState } from 'react'
import styles from './index.module.css'
import InputField from './InputField'

import { MessagesContext } from '../../../../context/MessagesContext'

const PersonalSettingsColumn = () => {

    const { userData } = useContext(MessagesContext)
    const initState = {
        name: userData.personal.name || '',
        company: userData.personal.company || '',
        position: userData.personal.position || '',
        email: userData.personal.email || '',
        mobile: userData.personal.mobile || '',
    }

    const [data, setData] = useState(initState)

    function updateData(key, value) {
        setData({
            ...data,
            [key]: value
        })
    }

    function updateProfile(e) {
        e.preventDefault()
        // fetch post or socket emit? that is the question
        // if (instant update for other users is necessary); then use socket; else use fetch; fi
        
        console.log(data)
    }

    return (
        <div className={styles['personal-settings-container']}>
            <div className={styles['title']}>
                <u>Personal Settings</u>
            </div>
            <form className={styles['form']} onSubmit={(e) => updateProfile(e)}>
                {Object.entries(data).map(([key, value]) => {
                    return (
                        <InputField key={key} input={key} value={value} updateData={updateData}/>
                    )
                })}
                <button type="button" onClick={() => setData(initState)}>Revert</button>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    )
}

export default PersonalSettingsColumn


// fetch:
// pros:
//      direct send to api (avoid socket logic)
// cons:
//      new route on server
//      authorization
//      if name is changed maybe socket must be used anyway?
// 
//
// socket:
// pros:
//      updates could be sent instantaneous to other users
// cons:
//      overloading socket server with maybe unnecessary broadcasting