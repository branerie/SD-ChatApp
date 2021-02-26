import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../context/MessagesContext'
import ChatWindow from '../ChatWindow'
import ProjectSettings from '../ProjectSettings'
import ProfileSettings from '../ProfileSettings'
import ProjectsMenu from '../ProjectsMenu'
import ProjectsList from '../ProjectsList'
import GroupsList from '../ProjectSidebar/GroupsList'
import MembersList from '../ProjectSidebar/MembersList'
import ChatsList from '../ChatsList'
import ProfileInfoBox from '../ProfileInfoBox'

const menu = {
    projects: <ProjectsMenu />,
    profile: <ProfileSettings />,
    settings: <ProjectSettings />
}

const win = {
    chats: <ChatsList />,
    sites: <ProjectsList />,
    groups: <GroupsList />,
    members: <MembersList />,
    messages: <ChatWindow />,
    details: <ProfileInfoBox />,
}

const ChatMainMobile = () => {
    const { userData } = useContext(MessagesContext)

    return (
        <div className={styles.container}>
            {/* {userData.activeMenu ? menu[userData.activeMenu] : <ChatWindow />} */}
            {
                userData.activeMenu
                    ? menu[userData.activeMenu]
                    : win[userData.activeWindow]
                        // ? <GroupsList />
                        // : <ProjectsList />
            }
        </div>
    )
}

export default ChatMainMobile
