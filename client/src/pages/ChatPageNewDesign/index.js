import React from 'react'
import styles from './index.module.css'
import ChatMessageInput from '../../components/ChatMessageInput'
import ChatGroupMembers from '../../components/ChatGroupMembers'
import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import ProjectsList from '../../components/NewDesignComponents/ProjectsListBox/ProjectsList'
import SelectedProject from '../../components/NewDesignComponents/SelectedProjectBox/SelectedProject'
import ChatBox from '../../components/NewDesignComponents/ChatBox/'
import ProfileInfoBox from '../../components/NewDesignComponents/ProfileInfoBox'
import IsOpenedContext from '../../context/isOpened'

const ChatPageNewDesign = () => {
    return (
        <SocketContextProvider>
            <MessagesContextProvider>
                {/* <IsOpenedContext> */}
                    <div className={styles['chat-page-new-design']}>
                        <ProjectsList />
                        <SelectedProject />
                        <ChatBox />
                        <ProfileInfoBox />
                    </div>
                {/* </IsOpenedContext> */}
            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default ChatPageNewDesign
