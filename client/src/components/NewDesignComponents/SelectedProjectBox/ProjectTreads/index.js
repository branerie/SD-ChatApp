import React, { useContext, useEffect } from 'react'
import styles from './index.module.css'
import Thread from './Thread'
import { MessagesContext } from '../../../../context/MessagesContext'

const ProjectTreads = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    useEffect(() => {
        
        return () => {
            
        }
    }, [userData])

    if (!userData || !userData.activeSite) return null //<div>Loading...</div>

    let groups = Object.entries(userData.sites[userData.activeSite].groups).sort((A, B) => {
        // default sort: Group "General" on top and the rest alphabetical
        return (B[1].name === 'General') - (A[1].name === 'General') || A[1].name.localeCompare(B[1].name)
    })

    

    return (
        <ul className={styles['project-treads']}>

            {groups.map(([gid, group]) => {
                    let classList = []
                    if (gid === userData.activeGroup) classList.push("selected")
                    return (
                        <li key={gid} className={styles['list']}>
                            <Thread title={group.name} gid={gid} />
                        </li>
                    )
                })}
        </ul>
    )
}

export default ProjectTreads
