import css from './index.module.css'
import BasicSettings from './BasicSettings'
import AddGroup from './AddGroup'
import SearchPeople from './SearchPeople'
import GroupsMembership from './GroupsMembership'
import PendingList from './PendingList'

const ProjectSettings = () => {
    return (
        <div className={css.menu}>
            <h3 className={css.title}>Project Settings</h3>
            <BasicSettings />
            <GroupsMembership />
            <AddGroup />
            <PendingList />
            <SearchPeople />
        </div>
    )
}

export default ProjectSettings
