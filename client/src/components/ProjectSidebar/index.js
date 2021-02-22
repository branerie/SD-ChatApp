import styles from './index.module.css'
import GroupsList from './GroupsList'
import MembersList from './MembersList'

const ProjectSidebar = () => {
    return (
        <div className={styles.container}>
            <GroupsList />
            <MembersList />
        </div>
    )
}

export default ProjectSidebar
