import { useContext, useState } from 'react'
import theme from './theme.module.css'
import styles from './index.module.css'
import LeftSidebar from '../../components/LeftSidebar'
import ProjectSidebar from '../../components/ProjectSidebar'
import ChatMain from '../../components/ChatMain'
import ProfileInfoBox from '../../components/ProfileInfoBox'
import { MessagesContext } from '../../context/MessagesContext'
import shrinkArrow from '../../images/arrowLeft.png'
import expandArrow from '../../images/arrowRight.png'

const ChatPageWrapper = () => {
    const [isSmallSiteList, setIsSmallSiteList] = useState(false)
    const { userData } = useContext(MessagesContext)
    if (!userData) return null
    
    return (
        <div className={theme[userData.personal.theme]}>
            <div className={styles.container}>
                {Object.keys(userData.sites).length > 0 && 
                    <>
                        <LeftSidebar isSmallList={isSmallSiteList} />
                        <div className={styles['info-bar']} onClick={() => setIsSmallSiteList(!isSmallSiteList)}>
                            <img 
                                src={isSmallSiteList ?  expandArrow : shrinkArrow } 
                                className={styles['arrow-img']} 
                                alt='Expand/contract menu'
                            />
                        </div>
                    </>
                }
                {userData.activeSite && <ProjectSidebar />}
                <ChatMain />
                <ProfileInfoBox />
            </div>
        </div>
    )
}

export default ChatPageWrapper
