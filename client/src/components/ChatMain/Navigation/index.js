import { useContext } from 'react'
import styles from './index.module.css'
import { AuthenticateUser } from '../../../context/AuthenticationContext'
import { MessagesContext } from '../../../context/MessagesContext'
import ProjectHeader from './ProjectHeader'
import ChatNavButton from '../../Buttons/ChatNavButton'
import SeparatingLine from '../../SeparatingLine'

const Navigation = () => {
    const { logOut } = AuthenticateUser()
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function loadProjects() {
        dispatchUserData({ type: 'load-projects' })
    }

    function loadProfile() {
        dispatchUserData({ type: 'load-profile' })
    }

    return (
        <>
        <div className={styles.nav}>
            {userData.activeSite ? <ProjectHeader /> : <div></div>}
            <div className={styles.buttons}>
                <ChatNavButton onClick={loadProjects} title='Projects' />
                <ChatNavButton onClick={loadProfile} title='Profile' />
                <ChatNavButton onClick={logOut} title='Logout' />
            </div>
        </div>
        <SeparatingLine horizontal={true} />
        </>
    )
}

export default Navigation
