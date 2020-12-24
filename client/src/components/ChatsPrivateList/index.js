import React, { useContext } from 'react'
// import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import CloseButton from '../Buttons/CloseButton'

const ChatsPrivateList = () => {
    const context = useContext(MessagesContext)

    function handleClick(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        context.dispatchUserData({type: "load-chat", payload: {chat}})
    }

    if (!context.userData) return null //<div>Loading...</div>
    const chats = context.userData.chats
    
    return (
        <div>
            <h2>chats</h2>
            <ul>
                {Object.keys(chats).map(chat => {
                    return (
                        <li key={chat}
                            className={`
                                    ${chat === context.userData.activeChat ? "selected" : ""}
                                    ${context.newMessages[chat] && chat !== context.activeWindow ? 'new-messages' : ''}
                                    `}
                            onClick={(e) => handleClick(e, chat)}>
                            <span>{chats[chat].username}</span>
                            <CloseButton name="X" type="chat" chat={chat} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )

}

export default ChatsPrivateList