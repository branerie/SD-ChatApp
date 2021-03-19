import { useContext, useState } from 'react'
import styles from './index.module.css'

import Icon from '../../../Common/Icon'

import { SocketContext } from '../../../../context/SocketContext'
import { MessagesContext } from '../../../../context/MessagesContext'

const GroupCard = ({ name, id, selected, onClick }) => {

    const { dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)

    const [editMode, setEditMode] = useState(false)
    const [newName, setNewName] = useState(name)
    const [errors, setErrors] = useState([])

    function changeName() {
        if (newName === name) {
            setErrors([])
            setEditMode(false)
            return
        }
        socket.emit('change-group-name', { gid: id, group: newName }, (success, data) => {
            if (success) {
                dispatchUserData({ type: 'change-group-name', payload: { data } })
                setEditMode(false)
            } else {
                setErrors(data)
            }
        })
    }

    function rollBack() {
        setNewName(name)
        setErrors([])
        setEditMode(false)
    }

    if (editMode) return (
        <>
            <div className={styles.edit}>
                <input className={styles.input} type="text" value={newName} autoFocus onChange={(e) => setNewName(e.target.value)} />
                <div className={styles.icons} >
                    {newName !== name && <Icon icon='ok' onClick={() => changeName()} />}
                    <Icon icon='cancel' onClick={rollBack} />
                </div>
            </div>
            {errors.length > 0 &&
                <ul className={styles.errors}>
                    {errors.map((error, index) => {
                        return <li key={index}><small>{error}</small></li>
                    })}
                </ul>
            }
        </>
    )

    return (
        <div className={`${styles.card} ${selected ? styles.selected : null}`} >
            <div className={styles.name} onClick={onClick} >
                <span>{name}</span>
            </div>
            {name !== "General" &&
                <div className={styles.icons} >
                    <Icon icon='edit' onClick={() => setEditMode(true)} />
                </div>
            }
        </div >
    )
}

export default GroupCard