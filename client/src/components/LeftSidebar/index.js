import React from 'react'
import styles from './index.module.css'
import ProjectsList from '../ProjectsList'
import ChatsList from '../ChatsList'
import SeparatingLine from '../SeparatingLine'

const LeftSidebar = ({ isSmallList }) => {
    return (
        <div className={`${styles['projects-list']} ${isSmallList && styles['project-small-list']}`}>
            <ProjectsList isSmallList={isSmallList}/>
            <SeparatingLine horizontal={true} />
            <ChatsList isSmallList={isSmallList}/>
        </div>
    )
}

export default LeftSidebar
