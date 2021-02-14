import React from 'react'
import styles from './index.module.css'
import Avatar from 'react-avatar'

const ProjectCircle = (props) => {
    
    return (
            <Avatar className={styles['circle']} name={props.name} size={90} round={10} />
    )
}

export default ProjectCircle
