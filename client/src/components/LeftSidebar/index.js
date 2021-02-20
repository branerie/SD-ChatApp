import { useState } from 'react'
import styles from './index.module.css'
import ProjectsList from '../ProjectsList'
import ChatsList from '../ChatsList'
import shrinkArrow from '../../images/arrowLeft.png'
import expandArrow from '../../images/arrowRight.png'

const LeftSidebar = () => {
    const [ isSmallList, setMakeSmallList] = useState(false)

    return (
        <div className={`${styles['projects-list']} ${isSmallList && styles['project-small-list']}`}>
            <ProjectsList isSmallList={isSmallList}/>
            <div className={styles['info-arrow']} onClick={() => setMakeSmallList(!isSmallList)}>
                <img src={isSmallList ?  expandArrow : shrinkArrow } className={styles['arrow-img']} alt=''/>
            </div>
            <ChatsList isSmallList={isSmallList}/>
        </div>
    )
}

export default LeftSidebar
