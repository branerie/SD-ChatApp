import React from 'react'
import styles from './index.module.css'
import StatusLightsBox from '../StatusLightsBox'
import ProjectCircleBox from '../ProjectCircleBox'

const ProjectsList = () => {
    return (
        <div className={styles['projects-list']}>
            <StatusLightsBox />
            <ProjectCircleBox />
        </div>
    )
}

export default ProjectsList
