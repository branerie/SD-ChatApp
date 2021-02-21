import { useState, useContext } from 'react'
import styles from './index.module.css'
import { AuthenticateUser } from '../../../context/AuthenticationContext'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import ProjectHeader from './ProjectHeader'

const Navigation = () => {
    const { logOut } = AuthenticateUser()
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [theme, setTheme] = useState(userData.personal.theme || 'light')

    function loadProjects() {
        dispatchUserData({ type: 'load-projects' })
    }

    function loadProfile() {
        dispatchUserData({ type: 'load-profile' })
    }

    function changeTheme() {
        let newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        socket.emit('change-theme', newTheme)
        dispatchUserData({ type: 'change-theme' , payload: { theme: newTheme }})
    }

    return (
        <div className={styles.nav}>
            {userData.activeSite ? <ProjectHeader /> : <div></div>}
            <div className={styles.buttons}>
                <button onClick={changeTheme}>{theme === 'light' ? 'Dark' : 'Light'}</button>
                <button onClick={loadProjects}>Projects</button>
                <button onClick={loadProfile}>Profile</button>
                <button onClick={logOut}>Logout</button>
            </div>
        </div>
    )
}

export default Navigation
