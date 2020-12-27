import React, { useContext, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'

const ChatGroupMembers = () => {
    const { userData } = useContext(MessagesContext)
    const [memberName, setMemberName] = useState('')

    function handleClick(user) {
        // TODO
        // context.updateChats(user, "open")
        // context.changeWindow(user, false)
    }

    function addMember() {
        const group = userData.sites[userData.activeSite].groups[userData.activeGroup].name
        console.log(group, memberName);
        if (group === 'General') {
            // send invitation for site
        } else {
            // add user to group
        }
    }

    if (!userData) return null
    let members = userData.sites[userData.activeSite].groups[userData.activeGroup].members.sort((A,B) => {
        // default sort: alphabetical with online users on top and offline on bottom
        return userData.onlineMembers.includes(B._id) - userData.onlineMembers.includes(A._id) || A.username.localeCompare(B.username)
    })
    return (
        <div>
            <h2>members: {members.length}</h2>
            <div>
                <input onChange={e => setMemberName(e.target.value)} />
                <button className="join-btn" onClick={addMember}>Add</button>
            </div>
            <ul>
                {members.map(member => {
                    return <li
                        key={member._id}
                        className={userData.onlineMembers.includes(member._id) ? "online" : "offline"}
                        onDoubleClick={() => handleClick(member)}
                    >{member.username}</li>
                })}
            </ul>
        </div>
    )
}

export default ChatGroupMembers