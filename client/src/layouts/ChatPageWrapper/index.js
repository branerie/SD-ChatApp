import { useContext } from 'react'
import theme from './theme.module.css'
import styles from './index.module.css'
import LeftSidebar from '../../components/LeftSidebar'
import ProjectSidebar from '../../components/ProjectSidebar'
import ChatMain from '../../components/ChatMain'
import ProfileInfoBox from '../../components/ProfileInfoBox'
import { MessagesContext } from '../../context/MessagesContext'

const ChatPageWrapper = () => {
    const { userData } = useContext(MessagesContext)
    if (!userData) return null
    
    return (
        <div className={theme[userData.personal.theme]}>
            <div className={styles.container}>
                {Object.keys(userData.sites).length > 0 && <LeftSidebar />}
                {userData.activeSite && <ProjectSidebar />}
                <ChatMain />
                <ProfileInfoBox />
            </div>
        </div>
    )
}

export default ChatPageWrapper
