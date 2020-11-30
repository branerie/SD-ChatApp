import React from 'react'
import styles from './index.module.css'
import ProjectCircle from '../ProjectCircle'
import AvatarColors from '../../../../context/AvatarColors'
import Avatar from 'react-avatar'

const ProjectCircleBox = () => {
    return (
        <AvatarColors >
            <div className={styles['project-circle-box']}>
                <ProjectCircle name='aaa awda' />
                <ProjectCircle name='wdadw as' />
                <ProjectCircle name='adwd gtt' />
                <ProjectCircle name='awd taqe' />
                <ProjectCircle name='awd taqe' />
            </div>
        </AvatarColors>
    )
}

export default ProjectCircleBox
