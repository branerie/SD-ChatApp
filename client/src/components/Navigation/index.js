import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../context/MessagesContext'
import ProjectHeader from './ProjectHeader'
import ChatNavButton from '../Buttons/ChatNavButton'
import SeparatingLine from '../SeparatingLine'

const Navigation = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function searchProject() {
        dispatchUserData({ type: 'search-project' })
    }

    // function searchProjectMobile() {
    //     dispatchUserData({ type: 'search-project-mobile' })
    // }

    // function newProjectMobile() {
    //     dispatchUserData({ type: 'new-project-mobile' })
    // }

    function loadProfile() {
        dispatchUserData({ type: 'load-profile' })
    }

    function loadProjects() {
        dispatchUserData({ type: 'load-projects-mobile' })
    }

    function loadChats() {
        dispatchUserData({ type: 'load-chats-mobile' })
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

    // set global notification on new project messages or join requests to your projects
    function getProjectEvents() { // requests or messages
        let events = false
        for (const site in userData.sites) {
            if (events) break // exit outer loop if inner loop breaks
            if (userData.sites[site].requests && userData.sites[site].requests.length) {
                events = true
                break // exit outer loop
            } else {
                for (const group in userData.sites[site].groups) {
                    if (userData.sites[site].groups[group].unread) {
                        events = true
                        break // exit inner loop
                    }
                }
            }
        }
        return events
    }

    // set global notification on new private messages
    function getChatEvents() {
        let events = false
        for (const chat in userData.chats) {
            if (userData.chats[chat].unread) {
                events = true
                break
            }
        }
        return events
    }

    // set global notification on pending invitations sent to you
    function getInvitationEvents() {
        return userData.invitations && userData.invitations.length
    }

    return (
        <>
            <div className={styles.nav}>
                <div className={styles.title}>
                    <div className={`${styles.buttons} ${styles.mobile}`}>
                        {userData.activeSite
                            ? <ChatNavButton onClick={loadPrevious} icon='back' events={getProjectEvents()} />
                            : <ChatNavButton onClick={loadProjects} icon='projects' events={getProjectEvents()} />
                        }
                        <ChatNavButton onClick={loadChats} icon='chats' events={getChatEvents()} />
                    </div>
                    {userData.activeSite && <ProjectHeader />}
                </div>
                <div className={styles.buttons}>
                    <ChatNavButton onClick={searchProject} title='New / Search' icon='search' events={getInvitationEvents()} />
                    <ChatNavButton onClick={loadProfile} title='Profile' icon='profile' />
                </div>
            </div>
            <SeparatingLine horizontal={true} />
        </>
    )
}

export default Navigation
