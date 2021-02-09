import {useContext} from 'react'
import styles from './index.module.css'
import { AuthenticateUser } from '../../../../../context/authenticationContext'
import { MessagesContext } from '../../../../../context/MessagesContext'

const UserNav = () => {
    const { logOut } = AuthenticateUser()
    const { dispatchUserData } = useContext(MessagesContext)

    function loadProjects() {
        dispatchUserData({ type: 'load-projects' })
    }
    return (
        <div className={styles['user-nav']}>
            <button onClick={loadProjects}>Projects</button>
            <button>Profile</button>
            <button onClick={() => logOut()}>Logout</button>
        </div>
    )
}

export default UserNav
