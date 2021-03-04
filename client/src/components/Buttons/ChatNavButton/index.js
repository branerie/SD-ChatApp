import styles from './index.module.css'
import { ReactComponent as GroupChat } from '../../../icons/chat-group.svg'
import { ReactComponent as PrivateChat } from '../../../icons/chat-private.svg'
import { ReactComponent as Search } from '../../../icons/search-projects.svg'
import { ReactComponent as Profile } from '../../../icons/gear2.svg'
import { ReactComponent as LeftArrow } from '../../../icons/back.svg'
import { ReactComponent as Cancel } from '../../../icons/ban.svg'
import { ReactComponent as Accept } from '../../../icons/check-circle.svg'
import { ReactComponent as Info } from '../../../icons/info.svg'

const icons = {
    accept: <Accept />,
    cancel: <Cancel />,
    chats: <PrivateChat />,
    info: <Info />,
    profile: <Profile />,
    projects: <GroupChat />,
    search: <Search />,
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