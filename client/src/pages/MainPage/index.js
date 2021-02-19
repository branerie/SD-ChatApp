import React from 'react'
import styles from './index.module.css'
import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import LeftSidebar from '../../components/LeftSidebar'
import ProjectSidebar from '../../components/ProjectSidebar'
import ChatBox from '../../components/ChatBox'
import ProfileInfoBox from '../../components/ProfileInfoBox'

const ChatPageNewDesign = () => {
    return (
        <SocketContextProvider>
            <MessagesContextProvider>
                <div className={styles['chat-page-new-design']}>
                    <LeftSidebar />
                    <ProjectSidebar />
                    <ChatBox />
                    <ProfileInfoBox />
                </div>
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default ChatPageNewDesign
