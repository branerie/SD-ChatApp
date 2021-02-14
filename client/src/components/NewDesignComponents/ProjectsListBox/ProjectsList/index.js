import React from 'react'
import styles from './index.module.css'
import ProjectCircleBox from '../ProjectCircleBox'
import PrivateChatList from '../PrivateChatList'

const ProjectsList = () => {
    
    return (
        <div className={styles['projects-list']}>
            <ProjectCircleBox />
            <PrivateChatList />
        </div>
    )
}

export default ProjectsList
