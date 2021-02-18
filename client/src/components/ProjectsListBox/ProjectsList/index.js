import { useState } from 'react'
import styles from './index.module.css'
import ProjectCircleBox from '../ProjectCircleBox'
import PrivateChatList from '../PrivateChatList'
import shrinkArrow from '../../../images/arrowLeft.png'
import expandArrow from '../../../images/arrowRight.png'

const ProjectsList = () => {
    const [ isSmallList, setMakeSmallList] = useState(false)

    return (
        <div className={isSmallList ? `${styles['project-small-list']} ${styles['projects-list']}`: styles['projects-list']}>
            <div className={styles['info-arrow']} onClick={() => setMakeSmallList(!isSmallList)}>
                <img src={isSmallList ?  expandArrow : shrinkArrow } className={styles['arrow-img']} alt=''/>
            </div>
            <ProjectCircleBox isSmallList={isSmallList}/>
            <PrivateChatList isSmallList={isSmallList}/>
        </div>
    )
}

export default ProjectsList
