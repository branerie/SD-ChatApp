import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../context/MessagesContext'
import ChatWindow from '../ChatWindow'
import ProjectSettings from '../ProjectSettings'
import ProfileSettings from '../ProfileSettings'
import ProjectsMenu from '../ProjectsMenu'
// import SearchProject from '../ProjectsMenu/SearchProjects'
// import NewProject from '../ProjectsMenu/CreateProject'
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
    projects: <ProjectsMenu />,
    profile: <ProfileSettings />,
    settings: <ProjectSettings />,
    chats: <ChatsList />,
    sites: <ProjectsList />,
    groups: <GroupsList />,
    members: <MembersList />,
    messages: <ChatWindow />,
    details: <ProfileInfoBox />,
    // searchProject: <SearchProject />,
    // newProject: <NewProject />,
}

const ChatMainMobile = () => {
    const { userData } = useContext(MessagesContext)

    return (
        <div className={styles.container}>
            {/* {userData.activeMenu ? menu[userData.activeMenu] : win[userData.activeWindow]} */}
            {win[userData.activeWindow]}
        </div>
    )
}

export default ChatMainMobile
