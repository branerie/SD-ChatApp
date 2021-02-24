import { useContext } from 'react'
import styles from './index.module.css'
import ProjectsList from '../ProjectsList'
import SeparatingLine from '../SeparatingLine'
import ChatsList from '../ChatsList'
import { MessagesContext } from '../../context/MessagesContext'

const LeftSidebar = ({ isSmallList }) => {
    const { userData } = useContext(MessagesContext)

    return (
        <div className={`${styles.container} ${isSmallList ? styles.shrink : styles.expand}`}>
            <ProjectsList isSmallList={isSmallList} />
            {Object.keys(userData.chats).length > 0 && <>
                <SeparatingLine horizontal={true} />
                <ChatsList isSmallList={isSmallList} />
            </>}
        </div>
    )
}

export default LeftSidebar
