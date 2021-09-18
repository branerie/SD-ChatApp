import { useContext } from 'react'
import css from './index.module.css'

import ListHeader from '../../Common/ListHeader'
import ListItems from '../../Common/ListItems'

import Group from './Group'

import { MessagesContext } from '../../../context/MessagesContext'

const GroupsList = () => {
    const { userData } = useContext(MessagesContext)

    let groups = Object.entries(userData.sites[userData.activeSite].groups).sort((A, B) => {
        // Sort: Group "General" on top and the rest alphabetical
        return (B[1].name === 'General') - (A[1].name === 'General') || A[1].name.localeCompare(B[1].name)
    })

    return (
        <div className={css.container}>
            <ListHeader title={`groups (${groups.length})`} />
            <ListItems>
                {groups.map(([gid, group]) => <Group key={gid} title={group.name} gid={gid} />)}
            </ListItems>
        </div>
    )
}

export default GroupsList
