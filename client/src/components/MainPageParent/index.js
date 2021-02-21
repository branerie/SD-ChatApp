import { useContext } from 'react'
import theme from './theme.module.css'
import styles from './index.module.css'
import LeftSidebar from '../LeftSidebar'
import ProjectSidebar from '../ProjectSidebar'
import MainWindow from '../MainWindow'
import ProfileInfoBox from '../ProfileInfoBox'
import { MessagesContext } from '../../context/MessagesContext'

const MainPageParent = () => {
    const { userData } = useContext(MessagesContext)
    if (!userData) return null
    
    return (
        <div>
            <div className={`${theme[userData.personal.theme]} ${styles.container}`}>
                <LeftSidebar />
                <ProjectSidebar />
                <MainWindow />
                <ProfileInfoBox />
            </div>
        </div>
    )
}

export default MainPageParent
