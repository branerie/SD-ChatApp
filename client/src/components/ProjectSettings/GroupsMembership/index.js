import { useState, useContext } from "react"
import styles from './index.module.css'
import { MessagesContext } from "../../../context/MessagesContext"
import { SocketContext } from "../../../context/SocketContext"

import addArrow from '../../../images/arrow-left.png'
import remArrow from '../../../images/arrow-right.png'
import SeparatingLine from "../../SeparatingLine"
import UserAvatar from "../../Common/UserAvatar"

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
    const siteMembers = Object.values(userData.sites[userData.activeSite].groups).find(({ name }) => name === "General").members

    function loadGroup(gid) {
        const { members } = userData.sites[userData.activeSite].groups[gid]
        setGroup(gid)
        setGroupMembers(members)
        setRestMembers(siteMembers.filter(m => !members.includes(m)))
    }

    function addMember(member) {
        socket.emit("add-member", { member, group }, () => {
            setGroupMembers([...groupMembers, member])
            setRestMembers(restMembers.filter(m => m !== member))
        })
    }

    function removeMember(member) {
        socket.emit("remove-member", {member, group }, () => {
            setRestMembers([...restMembers, member])
            setGroupMembers(groupMembers.filter(m => m !== member))
        })
    }

    if (groups.length < 2) return null

    return (
        <>
            <div className={styles.section}>
                <p className={styles.title}>Membership</p>
                <div className={styles.container}>
                    <div className={`${styles.column} ${styles.group}`}>
                        <p className={styles['column-title']}>Select group:</p>
                        {groups.map(([id, data]) => {
                            if (data.name === 'General') return null // sort of continue in map
                            return (
                                <div
                                    key={id}
                                    onClick={() => loadGroup(id)}
                                    className={id === group ? styles.selected : styles.listed}
                                >{data.name}</div>
                            )
                        })
                        }
                    </div>
                    <div className={styles.column}>
                        <p className={styles['column-title']}>Group members:</p>
                        {group &&
                            groupMembers.map(m => {
                                if (m === userData.personal._id) return null
                                return (
                                    <div key={m} className={styles.addmember}>
                                        <div onClick={() => removeMember(m)} className={styles['add-btn']}>
                                            <UserAvatar picturePath={userData.associatedUsers[m].picture} />
                                            <span style={{ marginLeft: '5px' }}>
                                                {userData.associatedUsers[m].name}
                                            </span>
                                            <img alt='Add Link' src={remArrow} className={styles.arrow} />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.column}>
                        <p className={styles['column-title']}>Other members:</p>
                        {group &&
                            restMembers.map(m => {
                                if (m === userData.personal._id) return null
                                return (
                                    <div key={m} className={styles.addmember}>
                                        <div onClick={() => addMember(m)} className={styles['add-btn']}>
                                            <img alt='Add Link' src={addArrow} className={styles.arrow} />
                                            <span className={styles.member}>
                                                <UserAvatar picturePath={userData.associatedUsers[m].picture} />
                                                <span style={{ marginLeft: '5px' }}>
                                                    {userData.associatedUsers[m].name}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
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
