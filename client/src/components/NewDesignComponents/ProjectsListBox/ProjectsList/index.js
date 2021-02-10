import React from 'react'
import styles from './index.module.css'
import StatusLightsBox from '../StatusLightsBox'
import ProjectCircleBox from '../ProjectCircleBox'
import NewProject from '../NewProject'
import PrivateChatList from '../PrivateChatList'



const ProjectsList = () => {
    
    return (
        <div className={styles['projects-list']}>
            {/* <StatusLightsBox /> */}
            <ProjectCircleBox />
            <PrivateChatList />
            {/* <NewProject /> */}
        </div>
    )
}

export default ProjectsList
