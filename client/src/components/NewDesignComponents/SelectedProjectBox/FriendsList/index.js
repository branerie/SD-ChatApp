import React, { useState, useContext } from 'react'
import styles from './index.module.css'
import Friend from '../Friend'
import { MessagesContext } from '../../../../context/MessagesContext'
import TransparentBackground from '../../CommonComponents/TransparentBackground'

const FriendsList = () => {
    const { userData } = useContext(MessagesContext)
    const [backgroundOpened, setBackgroundOpened] = useState(false)
    const [addMemberOpened, setAddMemberOpened] = useState(false)
    
    const closeOpenedWindows = () => {
        setBackgroundOpened(false)
        setAddMemberOpened(false)
    }

    function handleClick(member) {
        // TODO
        // context.updateChats(user, "open")
        // context.changeWindow(user, false)
    }

    if (!userData || !userData.activeSite) return null
    let members = userData.sites[userData.activeSite].groups[userData.activeGroup].members//.sort((A, B) => {
    //     // default sort: alphabetical with online users on top and offline on bottom
    //     return userData.associatedUsers[B._id].online - userData.associatedUsers[A._id].online || A.name.localeCompare(B.name)
    // })

    return (
        <div className={styles['friends-list']}>
            <ul>
                {members.map(member => {
                    return <li
                        key={member}
                        onDoubleClick={() => handleClick(member)}
                    >
                        <Friend 
                            name={userData.associatedUsers[member].name} 
                            id={member} 
                            picturePath={userData.associatedUsers[member].picture}
                            isOnline={userData.associatedUsers[member].online}
                        />
                    </li>
                })}
            </ul>
            <div>
                {backgroundOpened ? <TransparentBackground closeOpenedWindows={closeOpenedWindows} /> : <div />}
            </div>
        </div>
    )
}

export default FriendsList
