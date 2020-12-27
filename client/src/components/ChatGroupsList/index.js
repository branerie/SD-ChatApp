import React, { useState, useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'
// import CloseButton from '../Buttons/CloseButton'

const ChatGroupsList = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const [groupName, setGroupName] = useState()

    function handleClick(e, group) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-group", payload: { group } })
    }

    function createGroup() {
        let site = userData.activeSite
        socket.emit("create-group", { site, group: groupName }, (success, data) => {
            if (success) {
                dispatchUserData({ type: "join-group", payload: { site, ...data } })
            } else {
                // if (data === "You are already there.") dispatchUserData({type: "load-group", payload: {group}})
                // else console.log(data)
            }
        })
    }

    if (!userData) return null //<div>Loading...</div>
    let groups = Object.entries(userData.sites[userData.activeSite].groups).sort((A, B) => {
        // default sort: Group "General" on top and the rest alphabetical
        return (B[1].name === 'General') - (A[1].name === 'General') || A[1].name.localeCompare(B[1].name)
    })
    return (
        <div>
            <h2>groups: {groups.length}</h2>
            <div>
                <input onChange={e => setGroupName(e.target.value)} />
                <button className="join-btn" onClick={createGroup}>Add</button>
            </div>
            <ul>
                {groups.map(([gid, group]) => {
                    let classList = []
                    if (gid === userData.activeGroup) classList.push("selected")
                    // if (newMessages[gid] && gid !== userData.activeGroup) classList.push('new-messages')
                    return (
                        <li key={gid}
                            className={classList.join(" ")}
                            onClick={(e) => handleClick(e, gid)}>
                            <span>{group.name}</span>
                            {/* <CloseButton name="X" type="group" item={group.name} /> */}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ChatGroupsList