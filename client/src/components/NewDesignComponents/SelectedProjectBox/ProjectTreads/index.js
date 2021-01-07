import React from 'react'
import styles from './index.module.css'
import Tread from './Tread'

const ProjectTreads = () => {
    

    return (
        <div className={styles['project-treads']}>
            <Tread title='Ship Design' />
            <Tread title='Power Plant' />
            <Tread title='3D Laser Scanning' />
        </div>
    )
}

export default ProjectTreads
