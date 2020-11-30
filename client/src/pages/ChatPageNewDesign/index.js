import React from 'react'
import styles from './index.module.css'
import ChatMessageInput from '../../components/ChatMessageInput'
import ChatGroupMembers from '../../components/ChatGroupMembers'
import SocketContextProvider from '../../context/SocketContext'
import MessagesContextProvider from '../../context/MessagesContext'
import ProjectsList from '../../components/NewDesignComponents/ProjectsListBox/ProjectsList'
import SelectedProject from '../../components/NewDesignComponents/SelectedProjectBox/SelectedProject'


const ChatPageNewDesign = () => {
    return (
        <SocketContextProvider>
            <MessagesContextProvider>
                <div className={styles['chat-page-new-design']}>
                    <ProjectsList />
                    <SelectedProject />
                </div>

            </MessagesContextProvider>
        </SocketContextProvider>
    )
}

export default ChatPageNewDesign
