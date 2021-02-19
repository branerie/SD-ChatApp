import styles from './index.module.css'
import UserNav from '../UserNav'
import CreateProject from '../../../ProjectsMenu/CreateProject'
import SearchProjects from '../../../ProjectsMenu/SearchProjects'
import PendingProjects from '../../../ProjectsMenu//PendingProjects'
import { useContext } from 'react'
import { MessagesContext } from '../../../../context/MessagesContext'
import PersonalSettingsColumn from '../../../ProfileSettings/PersonalSettingsColumn'
import LogoColumn from '../../../ProfileSettings/LogoColumn'
import ProjectSettings from '../../../ProjectSettings'

const UserMenu = () => {
    const { userData: { activeMenu } } = useContext(MessagesContext)

    return (
        <div className={styles['user-menu']}>
            <UserNav />
            <div className={styles['user-menu-fields']}>
                { activeMenu === 'projects' &&
                <>
                    <CreateProject />
                    <SearchProjects />
                    <PendingProjects />
                </>
                }
                { activeMenu === 'profile' &&
                <div className={styles['profile-container']}>
                    <LogoColumn />
                    <PersonalSettingsColumn />
                </div>
                }
                { activeMenu === 'settings' &&
                <div >
                    <ProjectSettings />
                </div>
                }
            </div>
        </div>
    )
}

export default UserMenu