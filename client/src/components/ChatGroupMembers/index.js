import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import ChatGroupAddMember from '../ChatGroupAddMember'

const ChatGroupMembers = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function handleClick(user) {
        dispatchUserData({ type: 'open-chat', payload: { user } })
        // TODO
        // context.updateChats(user, "open")
        // context.changeWindow(user, false)
    }

    if (!userData || !userData.activeSite) return null
    let members = userData.sites[userData.activeSite].groups[userData.activeGroup].members.sort((A, B) => {
        // default sort: alphabetical with online users on top and offline on bottom
        return userData.onlineMembers.includes(B._id) - userData.onlineMembers.includes(A._id) || A.name.localeCompare(B.name)
    })
    return (
        <div>
            <h2>members: {members.length}</h2>
            {userData.sites[userData.activeSite].creator === userData.personal._id && <ChatGroupAddMember />}
            <ul>
                {members.map(member => {
                    return <li
                        key={member._id}
                        className={userData.onlineMembers.includes(member._id) ? "online" : "offline"}
                        onDoubleClick={() => handleClick(member)}
                    >{member.name}</li>
                })}
            </ul>
        </div>
    )
}

export default ChatGroupMembers