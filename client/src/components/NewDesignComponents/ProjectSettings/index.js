import { useContext, useState } from 'react'
import styles from './index.module.css'
import { MessagesContext } from "../../../context/MessagesContext"
import PendingList from './PendingList'
import GroupsMembership from './GroupsMembership'

const ProjectSettings = () => {
    const { userData } = useContext(MessagesContext)
    const [description, setDescription] = useState(userData.sites[userData.activeSite].description)
    const [group, setGroup] = useState()
    const [member, setMember] = useState()
    

    function updateDescription() {

    }

    function addGroup() {

    }

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
            <h3>Project Settings</h3>
            <h2>{userData.sites[userData.activeSite].name}</h2>
            <div className={styles['form-control']} >
                <label htmlFor="a">Update project description</label>
                <input
                    className={styles.input}
                    type='text'
                    value={description}
                    placeholder='Project description...'
                    onChange={e => setDescription(e.target.value)} />
            </div>
            <button onClick={updateDescription}>Update</button>
            <div className={styles['form-control']} >
                <label htmlFor="a">Add new group</label>
                <input
                    className={styles.input}
                    type='text'
                    value={group}
                    placeholder='Group name...'
                    onChange={e => setGroup(e.target.value)} />
            </div>
            <button onClick={addGroup}>Add</button>
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
