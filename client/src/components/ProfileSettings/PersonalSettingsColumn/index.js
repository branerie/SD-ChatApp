import { useContext, useMemo, useState } from 'react'
import styles from './index.module.css'
import InputField from './InputField'

import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'

const PersonalSettingsColumn = () => {

    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)
    let initState
    if (userData) initState = {
        name: userData.personal.name || '',
        company: userData.personal.company || '',
        position: userData.personal.position || '',
        email: userData.personal.email || '',
        mobile: userData.personal.mobile || '',
    }
    
    const [data, setData] = useState(initState)
    
    const isModified = useMemo(() => {
        return Object.entries(data).some(([key, value]) => initState[key] !== value)
    }, [data, initState])
    
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
        socket.emit('update-profile-data', data, newData => {
            dispatchUserData({
                type: 'update-profile-data',
                payload: {
                    newData
                }
            })
        })
    }

    return (
        <div className={styles['personal-settings-container']}>
            <div className={styles['title']}>
                <u>Personal Settings</u>
            </div>
            <form className={styles['form']} onSubmit={(e) => updateProfile(e)}>
                {Object.entries(data).map(([key, value]) => {
                    return (
                        <InputField 
                            key={key} 
                            input={key}
                            value={value} 
                            updateData={updateData}
                            isChanged={initState[key] !== value}
                        />
                    )
                })}
                <button type="button" 
                    onClick={() => setData(initState)} 
                    className={`${styles['btn-revert']} ${styles.btn}`}
                    disabled={!isModified}
                >
                    Revert
                </button>
                <button 
                    type="submit"
                    className={`${styles['btn-save']} ${styles.btn}`}
                    disabled={!isModified}
                >
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default PersonalSettingsColumn