import React from 'react'
import styles from './index.module.css'
import ProjectTreads from '../ProjectTreads'
import ProjectList from '../ProjectList'

const SelectedProject = () => {
    return (
        <div className={styles['selected-project']}>
            <ProjectList />
            <ProjectTreads />
        </div>
    )
}

export default SelectedProject
