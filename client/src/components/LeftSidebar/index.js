import { useContext } from 'react'
import css from './index.module.css'
import ProjectsList from '../ProjectsList'
import SeparatingLine from '../SeparatingLine'
import ChatsList from '../ChatsList'
import { MessagesContext } from '../../context/MessagesContext'

const LeftSidebar = () => {
    const { userData } = useContext(MessagesContext)

    return (
        <div className={`${css.container} ${css[userData.listSize]}`}>
            <ProjectsList />
            {Object.keys(userData.chats).length > 0 && <>
                <SeparatingLine horizontal={true} />
                <ChatsList />
            </>}
        </div>
    )
}

export default LeftSidebar
