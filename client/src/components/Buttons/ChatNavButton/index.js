import styles from './index.module.css'
import { ReactComponent as GroupChat } from '../../../icons/chat-group.svg'
import { ReactComponent as PrivateChat } from '../../../icons/chat-private.svg'
import { ReactComponent as Search } from '../../../icons/search-projects.svg'
import { ReactComponent as Profile } from '../../../icons/gear2.svg'
import { ReactComponent as Logout } from '../../../icons/logout.svg'
import { ReactComponent as LeftArrow } from '../../../icons/back.svg'

const icons = {
    projects: <GroupChat />,
    chats: <PrivateChat />,
    search: <Search />,
    profile: <Profile />,
    logout: <Logout />,
    back: <LeftArrow />
}

const ChatNavButton = ({ onClick, title, icon }) => {
    return (
        <button
            className={styles.button}
            onClick={onClick}>
            <span>{title}</span>
            <i>{icons[icon]}</i>
        </button>
    )
}

export default ChatNavButton