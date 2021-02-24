import { useState, useContext } from 'react'
import styles from './index.module.css'
import ProjectsList from '../ProjectsList'
import SeparatingLine from '../SeparatingLine'
import ChatsList from '../ChatsList'
import {MessagesContext} from '../../context/MessagesContext'

const LeftSidebar = ({ isSmallList }) => {
    const [small, setSmall] = useState(false)
    const { userData } = useContext(MessagesContext)
    
    return (
        <div className={`${styles.container} ${small ? styles.shrink : styles.expand}`}>
            <ProjectsList isSmallList={small}/>
            {Object.keys(userData.chats).length > 0 &&
            <>
              <SeparatingLine horizontal={true} />
              <ChatsList isSmallList={small}/>}
            </>
        </div>
    )
}

export default LeftSidebar
