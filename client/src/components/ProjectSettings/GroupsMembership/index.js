import { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'

import SeparatingLine from '../../SeparatingLine'
import MemberCard from './MemberCard'
import GroupCard from './GroupCard'

const GroupsMembership = () => {
    const { userData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [group, setGroup] = useState('')
    const [groupMembers, setGroupMembers] = useState([])
    const [restMembers, setRestMembers] = useState([])

    let groups = Object.entries(userData.sites[userData.activeSite].groups).sort((A, B) => {
        // Sort: Alphabetical
        return A[1].name.localeCompare(B[1].name)
    })
    const siteMembers = Object.values(userData.sites[userData.activeSite].groups).find(({ name }) => name === 'General').members

    function loadGroup(gid) {
        const { members } = userData.sites[userData.activeSite].groups[gid]
        setGroup(gid)
        setGroupMembers(members)
        setRestMembers(siteMembers.filter(m => !members.includes(m)))
    }

    function addMember(member) {
        socket.emit('add-member', { member, group }, () => {
            setGroupMembers([...groupMembers, member])
            setRestMembers(restMembers.filter(m => m !== member))
        })
    }

    function removeMember(member) {
        socket.emit('remove-member', { member, group }, () => {
            setRestMembers([...restMembers, member])
            setGroupMembers(groupMembers.filter(m => m !== member))
        })
    }

    if (groups.length < 2) return null

    return (
        <>
            <div className={styles.section}>
                <p className={styles.header}>Membership</p>
                <div className={styles.container}>
                    <div className={styles.column}>
                        <p className={styles.title}>Select group</p>
                        {groups.map(([id, data]) => {
                            if (data.name === 'General') return null // sort of continue in map
                            return (
                                <GroupCard
                                    key={id}
                                    name={data.name}
                                    selected={id === group}
                                    onClick={() => loadGroup(id)}
                                />
                            )
                        })
                        }
                    </div>
                    <div className={styles.column}>
                        <p className={styles.title}>Group members</p>
                        {group && groupMembers.map(m => {
                            if (groupMembers.length === 1) return <div className={styles.empty}>No members</div>
                            if (m === userData.personal._id) return null // skip me
                            return (
                                <MemberCard
                                    key={m}
                                    type='del'
                                    name={userData.associatedUsers[m].name}
                                    picturePath={userData.associatedUsers[m].picture}
                                    onClick={() => removeMember(m)}
                                />
                            )
                        })
                        }
                    </div>
                    <div className={styles.column}>
                        <p className={styles.title}>Other members</p>
                        {group && restMembers.map(m => {
                            if (m === userData.personal._id) return null
                            return (
                                <MemberCard
                                    key={m}
                                    type='add'
                                    name={userData.associatedUsers[m].name}
                                    picturePath={userData.associatedUsers[m].picture}
                                    onClick={() => addMember(m)}
                                />
                            )
                        })
                        }
                    </div>
                </div>
            </div>
            <SeparatingLine horizontal={true} />
        </>
    )
}

export default GroupsMembership
