import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import Friend from '../Friend'
import { MessagesContext } from '../../../../context/MessagesContext'
import AddMember from './AddMember'
import TransparentBackground from '../../CommonComponents/TransparentBackground'
// import ChatGroupAddMember from '../../../ChatGroupAddMember'

const FriendsList = () => {
    const { userData } = useContext(MessagesContext)
    const [backgroundShown, setBackgroundShown] = useState(false)

    function handleClick(member) {
        // TODO
        // context.updateChats(user, "open")
        // context.changeWindow(user, false)
    }

    if (!userData || !userData.activeSite) return null
    let members = userData.sites[userData.activeSite].groups[userData.activeGroup].members.sort((A, B) => {
        // default sort: alphabetical with online users on top and offline on bottom
        return userData.onlineMembers.includes(B._id) - userData.onlineMembers.includes(A._id) || A.username.localeCompare(B.username)
    })

    return (
        <div className={styles['friends-list']}>
            <ul>
                {members.map(member => {
                    return <li
                        key={member._id}
                        className={userData.onlineMembers.includes(member._id) ? "online" : "offline"}
                        onDoubleClick={() => handleClick(member)}
                    >
                        <Friend name={member.username} />
                    </li>
                })}
            </ul>
            <button onClick={()=>setBackgroundShown(true)}>Invite Member</button>
            <div>
                {backgroundShown ? <AddMember /> : <div />}
            </div>
            <div>
                {backgroundShown ? <TransparentBackground setBackgroundShown={setBackgroundShown} /> : <div />}
            </div>
        </div>
    )
}

export default FriendsList
