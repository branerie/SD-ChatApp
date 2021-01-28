import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const AddProject = (props) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [newSite, setNewSite] = useState()

    function createSite(e) {
        e.preventDefault()
        socket.emit("create-site", newSite, (success, siteData) => {

            if (success) {
                dispatchUserData({ type: 'create-site', payload: { siteData, activeConnection: true } })
            } else {
                // if (data === "You are already there.") context.dispatchUserData({type: "load-site", payload: {site}})
                // else console.log(data)
            }
        })
        props.setBackgroundShown(false)
    }

    return (
        <div className={styles['window']}>
            <form type="text" className={styles['form']} onSubmit={(e)=>createSite(e)}>
                <input
                    className={styles['input']}
                    placeholder="Enter project name..."
                    value={newSite}
                    onChange={e => setNewSite(e.target.value)}
                /> <br/>
                <button className={styles['button']}>Create Project</button>
            </form>
        </div>
    )
}

export default AddProject
