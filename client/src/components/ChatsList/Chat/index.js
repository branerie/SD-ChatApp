import ChatSmall from './ChatSmall'
import ChatLarge from './ChatLarge'

const Chat = ({size, ...rest}) => {
    const chat = {
        small: <ChatSmall {...rest}/>,
        large: <ChatLarge {...rest}/>
    }

    return chat[size]        
}

export default Chat
