import React from 'react'
import styles from './index.module.css'
import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import ProjectsList from '../../components/ProjectsListBox/ProjectsList'
import SelectedProject from '../../components/SelectedProjectBox/SelectedProject'
import ChatBox from '../../components/ChatBox'
import ProfileInfoBox from '../../components/ProfileInfoBox'

const ChatPageNewDesign = () => {
    return (
        <SocketContextProvider>
            <MessagesContextProvider>
                <div className={styles['chat-page-new-design']}>
                    <ProjectsList />
                    <SelectedProject />
                    <ChatBox />
                    <ProfileInfoBox />
                </div>
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default ChatPageNewDesign
