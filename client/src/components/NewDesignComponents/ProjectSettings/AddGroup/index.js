import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from "../../../../context/MessagesContext"
import { SocketContext } from "../../../../context/SocketContext"

const AddGroup = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [group, setGroup] = useState()
    const [errors, setErrors] = useState([])

    function addGroup() {
        let site = userData.activeSite
        socket.emit("create-group", { site, group }, (success, groupData) => {
            if (success) {
                dispatchUserData({ type: "create-group", payload: { site, groupData, activeConnection: true } })
                setGroup('')
            } else {
                setErrors(groupData)
            }
        })
    }

    return (
        <div className={styles['menu-field']}>
            <div className={styles['form-control']} >
                <label htmlFor="a">Add new group</label>
                <input
                    className={styles.input}
                    type='text'
                    placeholder='Group name...'
                    onChange={e => setGroup(e.target.value)}
                />
            </div>
            <button className={styles['form-btn']} onClick={addGroup}>Add</button>
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
