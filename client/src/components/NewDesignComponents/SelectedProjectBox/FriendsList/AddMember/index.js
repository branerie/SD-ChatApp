import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const AddMember = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [member, setMember] = useState('')

    

    return (
        <div className={styles['window']}>
            <form type="text" className={styles['form']} onSubmit={()=>{}}>
                <input
                    className={styles['input']}
                    placeholder="Enter member name..."
                    value={member}
                    onChange={e => setMember(e.target.value)}
                /> <br/>
                <button className={styles['button']}>Invite Member</button>
            </form>
        </div>
    )
}

export default AddMember
