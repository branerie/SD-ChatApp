import { useContext } from 'react'
import styles from './index.module.css'
import GroupsList from './GroupsList'
import MembersList from './MembersList'
import { MessagesContext } from '../../context/MessagesContext'

const ProjectSidebar = () => {
    const { userData } = useContext(MessagesContext)

    if (!userData.activeSite) return null
    return (
        <div className={styles.container}>
            <GroupsList />
            <MembersList />
        </div>
    )
}

export default ProjectSidebar
