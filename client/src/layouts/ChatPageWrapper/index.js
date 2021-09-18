import { useContext } from 'react'
import theme from './theme.module.css'
import styles from './index.module.css'
import Navigation from '../../components/Navigation'
import LeftSidebar from '../../components/LeftSidebar'
import ProjectSidebar from '../../components/ProjectSidebar'
import ChatMain from '../../components/ChatMain'
import ChatMainMobile from '../../components/ChatMainMobile'
import ProfileInfoBox from '../../components/ProfileInfoBox'
import { MessagesContext } from '../../context/MessagesContext'
import shrinkArrow from '../../images/arrow-left.png'
import expandArrow from '../../images/arrow-right.png'

const ChatPageWrapper = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function changeListSize() {
        dispatchUserData({type: 'change-list-size'})
    }

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
                                <LeftSidebar/>
                                <div className={styles.resizer} onClick={changeListSize}>
                                    <img
                                        src={userData.listSize === 'large' ? shrinkArrow : expandArrow}
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
