import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import CloseButton from '../Buttons/CloseButton'

const ChatGroupMembers = () => {
    const context = useContext(MessagesContext)

    function handleClick(user) {
        context.updateChats(user, "open")
        context.changeWindow(user, false)
    }

    function handleClickGroup(e, item) {
        if (e.target.nodeName === 'BUTTON') return
        context.changeWindow(item._id, true)
        // if group fetch userlist and messages from server and set state for first request complete
        // if chat fetch chat messages from server and set state for first request complete
    }


    // if (!windowIsGroup) return null
    return (
        <aside className="chat-sidebar">
            <h2>Groups</h2>
            <ul>
                {/* <li>General</li> */}
                {context.groups.map((item, i) => {
                    return (
                        <li key={item._id}
                            className={`
                                        ${item._id === context.activeWindow ? "selected" : ""} 
                                        ${(context.newMessages[item.name] && item.name !== context.activeWindow) ? 'new-messages' : ''}
                                        `}
                            onClick={(e) => handleClickGroup(e, item)}>
                            <span>{item.name}</span>
                            <CloseButton name="X" type="group" item={item.name} />
                        </li>
                    )
                })}
            </ul>
            <h2>members: {context.groupMembers[context.activeWindow] && context.groupMembers[context.activeWindow].online.length + context.groupMembers[context.activeWindow].offline.length}</h2>
            <ul>
                {context.groupMembers[context.activeWindow] && context.groupMembers[context.activeWindow].online.map((user, i) => {
                    return <li
                        key={`onUser${i}`}
                        className="online"
                        onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
            <ul>
                {context.groupMembers[context.activeWindow] && context.groupMembers[context.activeWindow].offline.map((user, i) => {
                    return <li
                        key={`offUser${i}`}
                        className="offline"
                        onDoubleClick={() => handleClick(user)}
                    >{user}</li>
                })}
            </ul>
        </aside>
    )
}

export default ChatGroupMembers