import { useContext } from 'react'
import styles from './index.module.css'
import ProjectHeader from './ProjectHeader'
import GroupsList from './GroupsList'
import MembersList from './MembersList'
import { MessagesContext } from '../../context/MessagesContext'

const ProjectSidebar = () => {
    const { userData } = useContext(MessagesContext)

    if (!userData.activeSite) return null
    return (
        <div className={styles.container}>
            <ProjectHeader />
            <GroupsList />
            <MembersList />
        </div>
    )
}

export default ProjectSidebar
