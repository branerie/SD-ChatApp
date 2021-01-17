import React, { useContext, useState } from 'react'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatGroupAddMember = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [member, setMember] = useState('')

    function inviteMember() {
        let site = userData.activeSite
        socket.emit("invite-user", { user: member, site }, (success, user) => {
            if (success) dispatchUserData({ type: 'invite-user', payload: { user, site } })
        })
    }

    function addMember() { //todo
        console.log(member)
        socket.emit("add-user", { user: member, site: userData.activeSite, group: userData.activeGroup }, (success, userID) => {
            // if (success) dispatchUserData({type: 'add-user', payload: {site: userData.activeSite, username: memberName, _id: userID}})
        })
    }

    const group = userData.sites[userData.activeSite].groups[userData.activeGroup]
    const groupMemberIds = group.members.map(member => member._id)
    const siteMembers = Object.values(userData.sites[userData.activeSite].groups).find(({ name }) => name === "General").members
    const restMembers = siteMembers.filter(member => !groupMemberIds.includes(member._id))
    return (
        <div>
            { group.name === "General"
                ? <>
                    <input onChange={e => setMember(e.target.value)} />
                    <button className="join-btn" onClick={inviteMember}>Invite</button>
                </>
                : <>
                    <select onChange={e => { setMember(e.target.options[e.target.selectedIndex].getAttribute('uid')) }}>
                        <option hidden value=""></option>
                        {restMembers.map(member => {
                            return (
                                <option key={member._id} uid={member._id} value={member.username}>{member.username}</option>
                            )
                        })}
                    </select>
                    <button className="join-btn" onClick={addMember}>Add</button>
                </>
            }
        </div>
    )
}

export default ChatGroupAddMember