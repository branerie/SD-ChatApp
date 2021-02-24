import { useContext, useMemo, useState } from 'react'
import styles from './index.module.css'

import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import MenuInput from '../../MenuInput'
import { capitalizeFirstLetter } from '../../../utils/text'
import MenuButton from '../../Buttons/MenuButton'

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
        <div className={styles.container}>
            <div className={styles.title}>Personal Settings</div>
            <form className={styles.form} onSubmit={(e) => updateProfile(e)}>
                {Object.entries(data).map(([key, value]) => {
                    return (
                        <label className={styles.input}>
                            {capitalizeFirstLetter(key)}:
                            <MenuInput
                                value={value}
                                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                                placeholder={`Enter new ${key}...`}
                            />
                        </label>
                    )
                })}
                <div className={styles.buttons}>
                    <MenuButton
                        btnType='default'
                        btnSize='medium'
                        title='Revert'
                        onClick={() => setData(initState)}
                        disabled={!isModified}
                    />
                    <MenuButton
                        btnType='submit'
                        btnSize='large'
                        title='Save Changes'
                        onClick={updateProfile}
                        disabled={!isModified}
                        style={{ marginLeft: '0.5rem' }}
                        isSubmit={true}
                    />
                </div>
            </form>
        </div>
    )
}

export default PersonalSettingsColumn
