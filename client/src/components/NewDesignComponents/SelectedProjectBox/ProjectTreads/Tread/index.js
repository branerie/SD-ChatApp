import React from 'react'
import styles from './index.module.css'
import {IsOpenedUseContext} from '../../../../../context/isOpened'

const ProjectTreads = (props) => {
    const context = IsOpenedUseContext()

    return (
            <div 
                className={styles['tread']}   
                onClick={() => { 
                    context.changeOpenState([props.title], true) 
                }}
            >
                {props.title}
            </div>
    )
}

export default ProjectTreads
