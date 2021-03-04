import { useContext } from 'react'
import styles from './index.module.css'
import { AuthenticateUser } from '../../context/AuthenticationContext'
import { MessagesContext } from '../../context/MessagesContext'
import ProjectHeader from './ProjectHeader'
import ChatNavButton from '../Buttons/ChatNavButton'
import SeparatingLine from '../SeparatingLine'

const Navigation = () => {
    const { logOut } = AuthenticateUser()
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function searchProject() {
        dispatchUserData({ type: 'search-project' })
    }

    function loadProfile() {
        dispatchUserData({ type: 'load-profile' })
    }

    function loadProjects() {
        dispatchUserData({ type: 'load-projects-mobile' })
    }

    function loadPrevious() {
        if (userData.activeWindow === 'groups') {
            dispatchUserData({ type: 'load-projects-mobile' })
        } else if (userData.activeWindow === 'details') {
            dispatchUserData({ type: 'load-members-mobile', payload: {} })
        } else if (userData.activeWindow === 'members') {
            dispatchUserData({ type: 'load-site', payload: { site: userData.activeSite } })
        } else if (userData.activeWindow === 'messages') {
            dispatchUserData({ type: 'load-site', payload: { site: userData.activeSite } })
        } else if (userData.activeWindow === 'settings') {
            dispatchUserData({ type: 'load-projects-mobile' })
        }
    }

    function loadChats() {
        dispatchUserData({ type: 'load-chats-mobile' })
    }

    function loadMembers() {
        dispatchUserData({ type: 'load-members-mobile' })
    }

    return (
        <>
            <div className={styles.nav}>
                {userData.activeSite
                    ?
                    <div className={styles.title}>
                        <div className={`${styles.buttons} ${styles.mobile}`}>
                            <ChatNavButton onClick={loadPrevious} icon='back' />
                        </div>
                        <ProjectHeader />
                    </div>
                    :
                    <div className={styles.title}>
                        <div className={`${styles.buttons} ${styles.mobile}`}>
                            <ChatNavButton onClick={loadProjects} icon='projects' />
                            <ChatNavButton onClick={loadChats} icon='chats' />
                        </div>
                    </div>
                }
                <div className={styles.buttons}>
                    <ChatNavButton onClick={searchProject} title='Search' icon='search' />
                    <ChatNavButton onClick={loadProfile} title='Profile' icon='profile' />
                    <ChatNavButton onClick={logOut} title='Logout' icon='logout' />
                </div>
            </div>
            <SeparatingLine horizontal={true} />
        </>
    )
}

export default Navigation
