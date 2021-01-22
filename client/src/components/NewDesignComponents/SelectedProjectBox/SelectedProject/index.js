import React from 'react'
import styles from './index.module.css'
import ProjectThreads from '../ProjectTreads'
import ProjectList from '../ProjectList'
import FriendsBox from '../FriendsBox'

const SelectedProject = () => {
    return (
        <div className={styles['selected-project']}>
            <ProjectList />
            <ProjectThreads />
            <FriendsBox />
        </div>
    )
}

export default SelectedProject
