import BasicSettings from './BasicSettings'
import AddGroup from './AddGroup'
import SearchPeople from './SearchPeople'
import GroupsMembership from './GroupsMembership'
import PendingList from './PendingList'

const ProjectSettings = () => {

    return (
        <div>
            <h3>Project Settings</h3>
            <BasicSettings />
            <AddGroup />
            <SearchPeople />
            <GroupsMembership />
            <PendingList />
        </div>
    )
}

export default ProjectSettings
