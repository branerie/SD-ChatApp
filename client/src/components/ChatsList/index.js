import { useContext } from 'react'
import css from './index.module.css'

import ListHeader from '../Common/ListHeader'
import ListItems from '../Common/ListItems'

import Chat from './Chat'

import { MessagesContext } from '../../context/MessagesContext'

const ChatsList = () => {
    const { userData } = useContext(MessagesContext)

    const chats = Object.keys(userData.chats)
    // Sort: Non. Default is in the order they are opened

    return (
        <div className={`${css.container} ${css[userData.listSize]}`}>
            <ListHeader title={`chats (${chats.length})`} />
            <ListItems>
                {chats.map(chat =>
                    <Chat
                        key={chat}
                        size={userData.listSize}
                        chat={chat}
                        unread={userData.chats[chat].unread}
                    />
                )}
            </ListItems>
        </div>
    )

}

export default ChatsList