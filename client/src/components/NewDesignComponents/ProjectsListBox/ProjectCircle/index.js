import React from 'react'
import styles from './index.module.css'
import Avatar, {ConfigProvider} from 'react-avatar'

const ProjectCircle = ({name}) => {
    
    return (
            <Avatar className={styles['circle']} name={name} size={40} round={true} />
    )
}

export default ProjectCircle
