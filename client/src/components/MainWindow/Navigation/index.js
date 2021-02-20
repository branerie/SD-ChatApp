import { useContext } from 'react'
import styles from './index.module.css'
import { AuthenticateUser } from '../../../context/AuthenticationContext'
import { MessagesContext } from '../../../context/MessagesContext'
import ProjectHeader from './ProjectHeader'

const Navigation = () => {
    const { logOut } = AuthenticateUser()
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function loadProjects() {
        dispatchUserData({ type: 'load-projects' })
    }

    function loadProfile() {
        dispatchUserData({ type: 'load-profile' })
    }

    function changeTheme() {
        dispatchUserData({ type: 'change-theme' })
    }

    return (
        <div className={styles.nav}>
            {userData.activeSite ? <ProjectHeader /> : <div></div>}
            <div className={styles.buttons}>
                <button onClick={changeTheme}>{userData.personal.theme === 'light' ? 'Dark' : 'Light'}</button>
                <button onClick={loadProjects}>Projects</button>
                <button onClick={loadProfile}>Profile</button>
                <button onClick={logOut}>Logout</button>
            </div>
        </div>
    )
}

export default Navigation
