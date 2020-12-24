import React, { useContext, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'

const ChatGroupMembers = () => {
    const context = useContext(MessagesContext)
    const [memberName, setMemberName] = useState('')

    function handleClick(user) {
        // TODO
        // context.updateChats(user, "open")
        // context.changeWindow(user, false)
    }

    function addMember() {
        const group = context.groups.find(group => group._id === context.activeWindow).name
        console.log(group, memberName);
        if (group === 'General') {
            // send invitation for site
        } else {
            // add user to group
        }
    }

    if (!context.userData) return null
    const members = context.userData.sites[context.userData.activeSite].groups[context.userData.activeGroup].members

    return (
        <div>
            <h2>members: {members.online.length + members.offline.length}</h2>
            <div>
                <input onChange={e => setMemberName(e.target.value)} />
                <button className="join-btn" onClick={addMember}>Add</button>
            </div>
            <ul>
                {members.online.map((user, i) => {
                    return <li
                        key={`onUser${i}`}
                        className="online"
                        onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
            <ul>
                {members.offline.map((user, i) => {
                    return <li
                        key={`offUser${i}`}
                        className="offline"
                        onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
        </div>
    )
}

export default ChatGroupMembers