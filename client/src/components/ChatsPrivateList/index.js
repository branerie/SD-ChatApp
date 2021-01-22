import React, { useContext, useRef, useEffect } from 'react'
// import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import CloseButton from '../Buttons/CloseButton'

const ChatsPrivateList = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    const prevActive = useRef()
    useEffect(() => {
        let { activeSite, activeGroup , activeChat } = userData
        prevActive.current = { activeSite, activeGroup , activeChat }
    })

    function handleClick(e, chat) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({type: "load-chat", payload: {chat}})
    }

    if (!userData) return null //<div>Loading...</div>
    const chats = userData.chats
    
    return (
        <div>
            <h2>chats</h2>
            <ul>
                {Object.keys(chats).map(chat => {
                    return (
                        <li key={chat}
                            className={`
                                    ${chat === userData.activeChat ? "selected" : ""}
                                    ${chats[chat].unread && chat !== userData.activeChat ? 'new-messages' : ''}
                                    `}
                            onClick={(e) => handleClick(e, chat)}>
                            <span>{chats[chat].username}</span>
                            <CloseButton chat={chat} lastActive={prevActive.current}/>
                        </li>
                    )
                })}
            </ul>
        </div>
    )

}

export default ChatsPrivateList