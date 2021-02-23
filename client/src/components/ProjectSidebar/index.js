import styles from './index.module.css'
import GroupsList from './GroupsList'
import MembersList from './MembersList'
import SeparatingLine from '../SeparatingLine'

const ProjectSidebar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <GroupsList />
                <MembersList />
            </div>
            <SeparatingLine horizontal={false} />
        </div>
    )
}

export default ProjectSidebar
