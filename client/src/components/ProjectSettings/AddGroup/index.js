import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from "../../../context/MessagesContext"
import { SocketContext } from "../../../context/SocketContext"

const AddGroup = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [group, setGroup] = useState()
    const [errors, setErrors] = useState([])

    function addGroup(open) {
        let site = userData.activeSite
        socket.emit("create-group", { site, group }, (success, groupData) => {
            if (success) {
                dispatchUserData({ type: "create-group", payload: { site, groupData, activeConnection: open } })
                setGroup('')
            } else {
                setErrors(groupData)
            }
        })
    }

    return (
        <div className={styles['menu-field']}>
            <div className={styles['form-control']} >
                <p>Add new group</p>
                <input
                    className={styles.input}
                    type='text'
                    placeholder='Group name...'
                    onChange={e => setGroup(e.target.value)}
                />
            </div>
            <button onClick={() => addGroup(false)}>Add</button>
            <button onClick={() => addGroup(true)}>Add &amp; Open</button>
            {errors.length > 0 &&
                <ul className={styles.errors}>
                    {errors.map((error, index) => {
                        return <li key={index}><small>{error}</small></li>
                    })}
                </ul>
            }
            <hr />
        </div>
    )
}

export default AddGroup
