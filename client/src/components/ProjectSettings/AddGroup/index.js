import React, { useState, useContext, useMemo } from 'react'
import styles from './index.module.css'
import { MessagesContext } from "../../../context/MessagesContext"
import { SocketContext } from "../../../context/SocketContext"
import MenuInput from '../../MenuInput'
import MenuButton from '../../Buttons/MenuButton'
import SeparatingLine from '../../SeparatingLine'

const AddGroup = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [group, setGroup] = useState()
    const [errors, setErrors] = useState([])

    const currentGroups = useMemo(() => {
        return Object.values(userData.sites[userData.activeSite].groups).map(g => g.name)
    }, [userData.sites])

    const isDisabled = useMemo(() => {
        return !group || currentGroups.includes(group)
    }, [group, currentGroups])

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
        <>
            <div className={styles['menu-field']}>
                <div className={styles['form-control']} >
                    <p>Add new group</p>
                    <MenuInput
                        value={group}
                        onChange={e => setGroup(e.target.value)}
                        placeholder='Group name...'
                    />
                </div>
                <MenuButton
                    title='Add &amp; Open'
                    btnSize='medium'
                    onClick={() => addGroup(true)}
                    disabled={isDisabled}
                    style={{ marginLeft: '0.5rem' }}
                />
                <MenuButton
                    title='Add'
                    btnType='submit'
                    btnSize='small'
                    onClick={() => addGroup(false)}
                    disabled={isDisabled}
                />
                {errors.length > 0 &&
                    <ul className={styles.errors}>
                        {errors.map((error, index) => {
                            return <li key={index}><small>{error}</small></li>
                        })}
                    </ul>
                }
            </div>
            <SeparatingLine horizontal={true} />
        </>
    )
}

export default AddGroup
