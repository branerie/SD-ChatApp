import styles from './index.module.css'
import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import LeftSidebar from '../../components/LeftSidebar'
import ProjectSidebar from '../../components/ProjectSidebar'
import MainWindow from '../../components/MainWindow'
import ProfileInfoBox from '../../components/ProfileInfoBox'

const MainPage = () => {
    return (
        <SocketContextProvider>
            <MessagesContextProvider>
                <div className={styles.container}>
                    <LeftSidebar />
                    <ProjectSidebar />
                    <MainWindow />
                    <ProfileInfoBox />
                </div>
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default MainPage
