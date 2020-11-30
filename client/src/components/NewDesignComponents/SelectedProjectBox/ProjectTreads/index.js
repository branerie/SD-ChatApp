import React from 'react'
import styles from './index.module.css'

const ProjectTreads = () => {
    return (
        <div className={styles['project-treads']}>
            <div className={styles['tread']}>
                Ship Design
            </div>
            <div className={styles['tread']}>
                Power Plant
            </div>
            <div className={styles['tread']}>
                3D Laser Scanning
            </div>
        </div>
    )
}

export default ProjectTreads
