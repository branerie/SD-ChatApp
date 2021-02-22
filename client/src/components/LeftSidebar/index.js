import { useState, useContext } from 'react'
import styles from './index.module.css'
import ProjectsList from '../ProjectsList'
import ChatsList from '../ChatsList'
import shrinkArrow from '../../images/arrowLeft.png'
import expandArrow from '../../images/arrowRight.png'
import {MessagesContext} from '../../context/MessagesContext'

const LeftSidebar = () => {
    const [small, setSmall] = useState(false)
    const { userData } = useContext(MessagesContext)

    return (
        <div className={`${styles.container} ${small ? styles.shrink : styles.expand}`}>
            <ProjectsList isSmallList={small}/>
            <div className={styles.arrow} onClick={() => setSmall(!small)}>
                <img src={small ?  expandArrow : shrinkArrow } className={styles.img} alt=''/>
            </div>
            {Object.keys(userData.chats).length > 0 && <ChatsList isSmallList={small}/>}
        </div>
    )
}

export default LeftSidebar
