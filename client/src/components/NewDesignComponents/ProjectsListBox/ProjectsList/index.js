import React from 'react'
import styles from './index.module.css'
import StatusLightsBox from '../StatusLightsBox'
import ProjectCircleBox from '../ProjectCircleBox'
import NewProject from '../NewProject'



const ProjectsList = () => {
    
    return (
        <div className={styles['projects-list']}>
            <StatusLightsBox />
            <ProjectCircleBox />
            <NewProject />
        </div>
    )
}

export default ProjectsList
