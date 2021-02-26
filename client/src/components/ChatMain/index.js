import { useContext } from 'react'
import styles from './index.module.css'
import ChatWindow from '../ChatWindow'
import ProjectSettings from '../ProjectSettings'
import ProfileSettings from '../ProfileSettings'
import ProjectsMenu from '../ProjectsMenu'
import { MessagesContext } from '../../context/MessagesContext'

const menu = {
    projects: <ProjectsMenu />,
    profile: <ProfileSettings />,
    settings: <ProjectSettings />
}

const ChatMain = () => {
    const { userData: { activeMenu } } = useContext(MessagesContext)

    return (
        <div className={styles.container}>
            {activeMenu ? menu[activeMenu] : <ChatWindow />}
        </div>
    )
}

export default ChatMain
