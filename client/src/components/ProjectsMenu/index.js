import styles from './index.module.css'
import CreateProject from './CreateProject'
import SearchProjects from './SearchProjects'
import PendingProjects from './PendingProjects'

const ProjectsMenu = () => {
    return (
        <div className={styles.menu}>
            <CreateProject />
            <SearchProjects />
            <PendingProjects />
        </div>
    )
}

export default ProjectsMenu
