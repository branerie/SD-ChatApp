import React, { useContext } from 'react'
import styles from './index.module.css'
import Tread from './Tread'
import { MessagesContext } from '../../../../context/MessagesContext'

const ProjectTreads = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    console.log(userData)
    function handleClick(e, group) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-group", payload: { group } })
    }

    if (!userData || !userData.activeSite) return null //<div>Loading...</div>

    let groups = Object.entries(userData.sites[userData.activeSite].groups).sort((A, B) => {
        // default sort: Group "General" on top and the rest alphabetical
        return (B[1].name === 'General') - (A[1].name === 'General') || A[1].name.localeCompare(B[1].name)
    })

    return (
        <div className={styles['project-treads']}>
            {/* <Tread title='Ship Design' />
            <Tread title='Power Plant' />
            <Tread title='3D Laser Scanning' /> */}
            {groups.map(([gid, group]) => {
                    let classList = []
                    if (gid === userData.activeGroup) classList.push("selected")
                    // if (newMessages[gid] && gid !== userData.activeGroup) classList.push('new-messages')
                    return (
                        <Tread title={group.name} />
                    )
                })}
        </div>
    )
}

export default ProjectTreads
