import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatGroupsAddGroup from '../ChatGroupsAddGroup'

const ChatGroupsList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function handleClick(e, activeGroup) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-group", payload: { activeGroup } })
    }

    if (!userData || !userData.activeSite) return null //<div>Loading...</div>
    let groups = Object.entries(userData.sites[userData.activeSite].groups).sort((A, B) => {
        // default sort: Group "General" on top and the rest alphabetical
        return (B[1].name === 'General') - (A[1].name === 'General') || A[1].name.localeCompare(B[1].name)
    })
    return (
        <div>
            <h2>groups: {groups.length}</h2>
            {userData.sites[userData.activeSite].creator === userData.personal._id && <ChatGroupsAddGroup />}
            <ul className="group-list">
                {groups.map(([gid, group]) => {
                    let classList = []
                    if (gid === userData.activeGroup) classList.push("selected")
                    if (group.unread && gid !== userData.activeGroup) classList.push('new-messages')
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