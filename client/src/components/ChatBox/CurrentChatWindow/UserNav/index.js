import { useContext } from 'react'
import styles from './index.module.css'
import { AuthenticateUser } from '../../../../context/AuthenticationContext'
import { MessagesContext } from '../../../../context/MessagesContext'

const UserNav = () => {
    const { logOut } = AuthenticateUser()
    const { dispatchUserData } = useContext(MessagesContext)

    function loadProjects() {
        dispatchUserData({ type: 'load-projects' })
    }

    function loadProfile() {
        dispatchUserData({ type: 'load-profile' })
    }

    return (
        <div className={styles['user-nav']}>
            <button onClick={loadProjects}>Projects</button>
            <button onClick={loadProfile}>Profile</button>
            <button onClick={logOut}>Logout</button>
        </div>
    )
}

export default UserNav
