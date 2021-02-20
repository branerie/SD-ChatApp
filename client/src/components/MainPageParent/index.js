import { useContext } from 'react'
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
            <div className={`${styles.container} ${styles[userData.personal.theme]}`}>
                <LeftSidebar />
                <ProjectSidebar />
                <MainWindow />
                <ProfileInfoBox />
            </div>
        </div>
    )
}

export default MainPageParent
