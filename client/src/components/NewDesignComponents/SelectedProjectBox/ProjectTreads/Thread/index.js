import React, { useContext } from 'react'
import styles from './index.module.css'
// import {IsOpenedUseContext} from '../../../../../context/isOpened'
import { MessagesContext } from '../../../../../context/MessagesContext'

const ProjectThreads = (props) => {
    // const context = IsOpenedUseContext()
    const { userData, dispatchUserData } = useContext(MessagesContext)

    if (!userData || !userData.activeSite) return null //<div>Loading...</div>

    function handleClick(e, activeGroup) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-group", payload: { activeGroup } })
    }

    return (
            <div 
                className={styles['tread']}   
                onClick={(e) => { 
                    // context.changeOpenState([props.title], true) 
                    handleClick(e, props.gid)
                }}
            >
                {props.title}
            </div>
    )
}

export default ProjectThreads
