import React, { useContext, useState } from 'react'
import { MessagesContext } from '../../context/MessagesContext'

const ChatGroupAddMember = () => {
    const { userData } = useContext(MessagesContext)
    const [memberName, setMemberName] = useState('')

    function addMember() {
        console.log(group.name, memberName);
        if (group.name === 'General') {
            // send invitation for site
        } else {
            // add user to group
        }
    }
    
    const group = userData.sites[userData.activeSite].groups[userData.activeGroup]
    const groupMemberIds = group.members.map(member => member._id)
    const siteMembers = Object.values(userData.sites[userData.activeSite].groups).find(({name}) => name === "General").members
    const restMembers = siteMembers.filter(member => !groupMemberIds.includes(member._id))
    return (
            <div>
                { group.name === "General"
                    ? <input onChange={e => setMemberName(e.target.value)} />
                    : <select>
                        {restMembers.map(member => {
                            return (
                                <option key={member._id} value={member.username}>{member.username}</option>
                            )
                        })}
                    </select>                    
                }
                <button className="join-btn" onClick={addMember}>Add</button>
            </div>
    )
}

export default ChatGroupAddMember