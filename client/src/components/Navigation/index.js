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
            dispatchUserData({ type: 'load-members-mobile' })
        } else if (userData.activeWindow === 'members') {
            dispatchUserData({ type: 'load-group', payload: {activeGroup: userData.activeGroup} })
        } else if (userData.activeWindow === 'messages') {
            dispatchUserData({ type: 'load-site', payload: {site: userData.activeSite} })
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
                            <ChatNavButton onClick={loadPrevious} icon='&#xf359;' />
                            {userData.activeGroup &&  userData.activeWindow === 'messages' && <ChatNavButton onClick={loadMembers} icon='&#xf0c0;' />}
                        </div>
                        <ProjectHeader />
                    </div>
                    :
                    <div>
                        <div className={`${styles.buttons} ${styles.mobile}`}>
                            <ChatNavButton onClick={loadProjects} icon='&#xf0c0;' />
                            <ChatNavButton onClick={loadChats} icon='&#xf406;' />
                        </div>
                    </div>
                }
                <div className={styles.buttons}>
                    <ChatNavButton onClick={searchProject} title='Search' icon='&#xf002;' />
                    <ChatNavButton onClick={loadProfile} title='Profile' icon='&#xf013;' />
                    <ChatNavButton onClick={logOut} title='Logout' icon='&#xf2f5;' />
                </div>
            </div>
            <SeparatingLine horizontal={true} />
        </>
    )
}

export default Navigation
