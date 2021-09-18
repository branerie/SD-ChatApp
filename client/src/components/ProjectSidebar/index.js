import styles from './index.module.css'
import GroupsList from './GroupsList'
import MembersList from './MembersList'
import SeparatingLine from '../SeparatingLine'

const ProjectSidebar = () => {
    return (
        <>
            <div className={styles.container}>
                <GroupsList />
                <SeparatingLine horizontal={true} />
                <MembersList />
            </div>
            <SeparatingLine horizontal={false} />
        </>
    )
}

export default ProjectSidebar
