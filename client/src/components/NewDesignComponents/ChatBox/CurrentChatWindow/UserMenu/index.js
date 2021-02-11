import styles from './index.module.css'
import UserNav from '../UserNav/'
import CreateProject from '../CreateProject'
import SearchProjects from '../SearchProjects'
import PendingProjects from '../PendingProjects'

const UserMenu = () => {

    return (
        <div className={styles['user-menu']}>
            <UserNav />
            <div className={styles['user-menu-fields']}>
                <CreateProject />
                <SearchProjects />
                <PendingProjects />
            </div>
        </div>
    )
}

export default UserMenu
