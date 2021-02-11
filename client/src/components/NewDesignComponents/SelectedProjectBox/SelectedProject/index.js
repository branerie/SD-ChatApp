import React, { useContext } from 'react'
import styles from './index.module.css'
import ProjectThreads from '../ProjectTreads'
import ProjectList from '../ProjectList'
import FriendsBox from '../FriendsBox'
import PendingList from '../PendingList'
import { MessagesContext } from '../../../../context/MessagesContext'

const SelectedProject = () => {
    const { userData, dispatchUserData} = useContext(MessagesContext)

    if (!userData.activeSite) return null
    return (
        <div className={styles['selected-project']}>
            <ProjectList />
            <ProjectThreads />
            <FriendsBox />
            <PendingList />
        </div>
    )
}

export default SelectedProject
