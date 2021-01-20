import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const AddGroup = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [groupName, setGroupName] = useState()

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
        <div className={styles['window']}>
            <form type="text" className={styles['form']} onSubmit={createGroup}>
                <input
                    className={styles['input']}
                    placeholder="Enter group name..."
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                /> <br/>
                <button className={styles['button']}>Create Group</button>
            </form>
        </div>
    )
}

export default AddGroup
