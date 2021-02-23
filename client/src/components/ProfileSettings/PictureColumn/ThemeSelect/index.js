import React, { useContext, useState } from 'react'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'
import Checkbox from '../../../Checkbox'
import styles from './index.module.css'

const ThemeSelect = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [theme, setTheme] = useState(userData.personal.theme || 'light')

    const changeTheme = (newTheme) => {
        setTheme(newTheme)
        socket.emit('change-theme', newTheme)
        dispatchUserData({ type: 'change-theme' , payload: { theme: newTheme }})
    }

    return (
        <div className={styles.select}>
            <h3 className={styles.title}>Theme:</h3>
            <Checkbox isSelected={theme === 'light'} onClick={() => changeTheme('light')} label='Light' />
            <Checkbox isSelected={theme === 'dark'} onClick={() => changeTheme('dark')} label='Dark' />
        </div>
    )
}

export default ThemeSelect