import { useState, useContext } from "react"
import styles from './index.module.css'
import { MessagesContext } from "../../../context/MessagesContext"
import { SocketContext } from "../../../context/SocketContext"

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

    return (
        <div className={styles['form-control']}>
            <p>Membership</p>
            <div className={styles.container}>
                <div className={styles.group}>
                    <p>Select group:</p>
                    <hr/>
                    {
                        siteGroups.map(gid => {
                            let { name } = userData.sites[userData.activeSite].groups[gid]
                            if (name === 'General') return null
                            return (
                                <div
                                    key={gid}
                                    onClick={() => loadGroup(gid)}
                                    className={gid === activeGroup ? styles.selected : undefined}
                                >{name}</div>
                            )
                        })
                    }
                </div>
                <div>
                    <p>Group members:</p>
                    <hr/>
                    {activeGroup &&
                        groupMembers.map(m => {
                            if (m === userData.personal._id) return null
                            return (
                                <div
                                    key={m}
                                    onClick={() => { }}
                                >{userData.associatedUsers[m].name}</div>
                            )
                        })
                    }
                </div>
                <div>
                    <p>Rest members:</p>
                    <hr/>
                    {activeGroup &&
                        restMembers.map(m => {
                            if (m === userData.personal._id) return null
                            return (
                                <div key={m} className={styles['add-member']}>
                                    <button onClick={() => addMember(m)}>&lt;&lt;</button>
                                    <div>{userData.associatedUsers[m].name}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default GroupsMembership
