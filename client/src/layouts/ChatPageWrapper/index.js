import { useContext, useState } from 'react'
import theme from './theme.module.css'
import styles from './index.module.css'
import Navigation from '../../components/Navigation'
import LeftSidebar from '../../components/LeftSidebar'
import ProjectSidebar from '../../components/ProjectSidebar'
import ChatMain from '../../components/ChatMain'
import ChatMainMobile from '../../components/ChatMainMobile'
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
                <Navigation />
                {userData.device === 'desktop'
                    ?
                    <div className={styles.main}>
                        {Object.keys(userData.sites).length > 0 &&
                            <>
                                <LeftSidebar isSmallList={isSmallSiteList} />
                                <div className={styles.resizer} onClick={() => setIsSmallSiteList(!isSmallSiteList)}>
                                    <img
                                        src={isSmallSiteList ? expandArrow : shrinkArrow}
                                        className={styles.arrow}
                                        alt='Expand/contract menu'
                                    />
                                </div>
                            </>
                        }
                        {userData.activeSite && <ProjectSidebar />}
                        <ChatMain />
                        <ProfileInfoBox />
                    </div>
                    :
                    <div className={styles.main}>
                        <ChatMainMobile />
                    </div>
                }
            </div>
        </div>
    )
}

export default ChatPageWrapper
