import { useContext } from 'react'
import styles from './index.module.css'
import Group from './Group'
import { MessagesContext } from '../../../context/MessagesContext'

const GroupsList = () => {
    const { userData } = useContext(MessagesContext)

    if (!userData || !userData.activeSite) return null //<div>Loading...</div>

    let groups = Object.entries(userData.sites[userData.activeSite].groups).sort((A, B) => {
        // default sort: Group "General" on top and the rest alphabetical
        return (B[1].name === 'General') - (A[1].name === 'General') || A[1].name.localeCompare(B[1].name)
    })

    return (
        <ul className={styles.container}>
            {groups.map(([gid, group]) => {
                return (
                    <li key={gid} >
                        <Group title={group.name} gid={gid} />
                    </li>
                )
            })}
        </ul>
    )
}

export default GroupsList
