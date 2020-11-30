import React from 'react'
import styles from './index.module.css'
import Avatar, {ConfigProvider} from 'react-avatar'


const ProjectCircle = (props) => {

    
    return (
        // <div  className={styles['circle']}>
        // </div>
            <Avatar className={styles['circle']} name={props.name} round={true} size={40} />
    )
}

export default ProjectCircle
