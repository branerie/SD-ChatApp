import styles from './index.module.css'
import BasicSettings from './BasicSettings'
import AddGroup from './AddGroup'
import SearchPeople from './SearchPeople'
import GroupsMembership from './GroupsMembership'
import PendingList from './PendingList'
import SeparatingLine from '../SeparatingLine'

const ProjectSettings = () => {

    return (
        <div className={styles.menu}>
            <h3>Project Settings</h3>
            <BasicSettings />
            <div className={styles.separator}>
                <SeparatingLine horizontal={true} />
            </div>
            <AddGroup />
            <SearchPeople />
            <div className={styles.separator}>
                <SeparatingLine horizontal={true} />
            </div>
            <GroupsMembership />
            <div className={styles.separator}>
                <SeparatingLine horizontal={true} />
            </div>
            <PendingList />
        </div>
    )
}

export default ProjectSettings
