import { useContext, useState } from 'react'
import styles from './index.module.css'
import { MessagesContext } from "../../../context/MessagesContext"
import BasicSettings from './BasicSettings'
import AddGroup from './AddGroup'
import PendingList from './PendingList'
import GroupsMembership from './GroupsMembership'

const ProjectSettings = () => {
    const { userData } = useContext(MessagesContext)
    const [member, setMember] = useState()

    function findPeople() {

    }

    // function inviteMember(e) {
    //     e.preventDefault()
    //     let site = userData.activeSite
    //     socket.emit("send-invitation", { user: member, site }, (success, user) => {
    //         if (success) dispatchUserData({ type: 'add-user-to-site-invitations', payload: { user, site } })
    //     })
    // }

    return (
        <div>
            <h2>{userData.sites[userData.activeSite].name}</h2>
            <h3>Project Settings</h3>
            <BasicSettings />
            <AddGroup />
            <div className={styles['form-control']} >
                <label htmlFor="a">Search for people and send invitations</label>
                <input
                    className={styles.input}
                    type='text'
                    value={member}
                    placeholder='Search by username, full name or email...'
                    onChange={e => setMember(e.target.value)} />
            </div>
            <button onClick={findPeople}>Search</button>
            <hr />
            <GroupsMembership />
            <PendingList />
        </div>
    )
}

export default ProjectSettings
