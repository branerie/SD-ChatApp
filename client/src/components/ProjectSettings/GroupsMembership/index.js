import { useState, useContext } from "react"
import styles from './index.module.css'
import { MessagesContext } from "../../../context/MessagesContext"
import { SocketContext } from "../../../context/SocketContext"

import addArrow from '../../../images/arrowLeft.png'
import SeparatingLine from "../../SeparatingLine"
import UserAvatar from "../../Common/UserAvatar"

const GroupsMembership = () => {
    const { userData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [activeGroup, setActiveGroup] = useState()
    const [groupMembers, setGroupMembers] = useState([])
    const [restMembers, setRestMembers] = useState([])

    const siteGroups = Object.keys(userData.sites[userData.activeSite].groups)
    const siteMembers = Object.values(userData.sites[userData.activeSite].groups).find(({ name }) => name === "General").members

    function loadGroup(gid) {
        const { members } = userData.sites[userData.activeSite].groups[gid]
        setActiveGroup(gid)
        setGroupMembers(members)
        setRestMembers(siteMembers.filter(m => !members.includes(m)))
    }

    function addMember(member) {
        socket.emit("add-member", { member, site: userData.activeSite, group: activeGroup }, () => {
            setGroupMembers([...groupMembers, member])
            setRestMembers(restMembers.filter(m => m !== member))
        })
    }

    if (siteGroups.length < 2) return null

    return (
        <>
        <div className={styles['form-control']}>
            <p className={styles.title}>Membership</p>
            <div className={styles.container}>
                <div className={`${styles.column} ${styles.group}`}>
                    <p className={styles['column-title']}>Select group:</p>
                    {
                        siteGroups.map(gid => {
                            let { name } = userData.sites[userData.activeSite].groups[gid]
                            if (name === 'General') return null
                            return (
                                <div
                                    key={gid}
                                    onClick={() => loadGroup(gid)}
                                    className={`${styles.name} ${gid === activeGroup && styles.selected}`}
                                >
                                    {name}
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.column}>
                    <p className={styles['column-title']}>Group members:</p>
                    {activeGroup &&
                        groupMembers.map(m => {
                            if (m === userData.personal._id) return null
                            return (
                                <div
                                    key={m}
                                    className={styles.name}
                                >
                                    {userData.associatedUsers[m].name}
                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.column}>
                    <p className={styles['column-title']}>Other members:</p>
                    {activeGroup &&
                        restMembers.map(m => {
                            if (m === userData.personal._id) return null
                            return (
                                <div key={m} className={`${styles.name} ${styles['add-member']}`}>
                                    <button onClick={() => addMember(m)} className={styles['add-btn']}>
                                        <img alt='Add Link' src={addArrow} className={styles.arrow} />
                                        <span className={styles.member}>
                                            <UserAvatar picturePath={userData.associatedUsers[m].picture} />
                                            <span style={{ marginLeft: '5px' }}>
                                                {userData.associatedUsers[m].name}
                                            </span>
                                        </span>
                                    </button>
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
