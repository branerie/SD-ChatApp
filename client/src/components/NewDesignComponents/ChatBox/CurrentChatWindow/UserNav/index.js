import {useContext} from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.module.css'
import { AuthenticateUser } from '../../../../../context/authenticationContext'
import { MessagesContext } from '../../../../../context/MessagesContext'

const UserNav = () => {
    const history = useHistory()
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
            <button onClick={() => history.push('/chat')}>Old</button>
        </div>
    )
}

export default UserNav
