import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const AddMember = ({closeOpenedWindows}) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [member, setMember] = useState('')

    const group = userData.sites[userData.activeSite].groups[userData.activeGroup]
    const groupMemberIds = group.members.map(member => member._id)
    const siteMembers = Object.values(userData.sites[userData.activeSite].groups).find(({ name }) => name === "General").members
    const restMembers = siteMembers.filter(member => !groupMemberIds.includes(member._id))

    function inviteMember(e) {
        e.preventDefault()
        let site = userData.activeSite
        socket.emit("send-invitation", { user: member, site }, (success, user) => {
            if (success) dispatchUserData({ type: 'add-user-to-site-invitations', payload: { user, site } })
        })
        closeOpenedWindows()
    }

    function addMember(e) {
        e.preventDefault()
        socket.emit("add-member", { member, site: userData.activeSite, group: userData.activeGroup }, (success, userID) => {
            // if (success) dispatchUserData({type: 'add-member', payload: {site: userData.activeSite, username: memberName, _id: userID}})
        })
        closeOpenedWindows()
    }

    return (
        <div>
            {
                group.name === "General" ?
                    <div className={styles['window']}>
                        <form type="text" className={styles['form']} onSubmit={(e) => inviteMember(e)}>
                            <input
                                className={styles['input']}
                                placeholder="Enter member name..."
                                value={member}
                                onChange={e => setMember(e.target.value)}
                            /> <br />
                            <button className={styles['button']}>
                                {group.name === 'General' ? 'Invite Member' : 'Add member'}
                            </button>
                        </form>
                    </div>
                    :
                    <div className={styles['window']}>
                        <form type="text" className={styles['form']} onSubmit={(e) => addMember(e)}>
                            <select
                                className={styles['input']}
                                onChange={e => { setMember(e.target.options[e.target.selectedIndex].getAttribute('uid')) }}
                            >
                                <option hidden value=""></option>
                                {restMembers.map(member => {
                                    return (
                                        <option key={member._id} uid={member._id} value={member.username}>{member.username}</option>
                                    )
                                })}
                            </select>
                            <br />
                            <button className={styles['button']}>                  Add member         </button>
                        </form>
                    </div>
            }
        </div>
    )
}

export default AddMember
