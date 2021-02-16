import styles from './index.module.css'
import UserNav from '../UserNav/'
import CreateProject from '../CreateProject'
import SearchProjects from '../SearchProjects'
import PendingProjects from '../PendingProjects'
import { useContext } from 'react'
import { MessagesContext } from '../../../../../context/MessagesContext'
import PersonalSettingsColumn from '../../../SettingPageComponents/PersonalSettingsColumn'
import LogoColumn from '../../../SettingPageComponents/LogoColumn'
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
