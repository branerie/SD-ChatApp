import React, { useState, useContext } from 'react'
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

const ChatGroupsAddGroup = () => {
    const [groupName, setGroupName] = useState()
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function createGroup() {
        let site = userData.activeSite
        socket.emit("create-group", { site, group: groupName }, (success, groupData) => {
            if (success) {
                dispatchUserData({ type: "create-group", payload: { site, groupData, activeConnection: true } })
            } else {
                // if (data === "You are already there.") dispatchUserData({type: "load-group", payload: {group}})
                // else console.log(data)
            }
        })
    }
    return (
        <div>
            <input onChange={e => setGroupName(e.target.value)} />
            <button className="join-btn" onClick={createGroup}>Add</button>
        </div>
    )
}

export default ChatGroupsAddGroup