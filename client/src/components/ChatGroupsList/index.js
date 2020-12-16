import React, { useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import CloseButton from '../Buttons/CloseButton'

const ChatGroupsList = () => {
    const context = useContext(MessagesContext)

    function handleClick(e, item) {
        if (e.target.nodeName === 'BUTTON') return
        context.changeWindow(item._id, true)
        // if group fetch userlist and messages from server and set state for first request complete
        // if chat fetch chat messages from server and set state for first request complete
    }

    return (
        <div>
            <h2>groups: {context.groups.length}</h2>
            <ul>
                {context.groups.map((item, i) => {
                    return (
                        <li key={item._id}
                            className={`
                                        ${item._id === context.activeWindow ? "selected" : ""} 
                                        ${(context.newMessages[item.name] && item.name !== context.activeWindow) ? 'new-messages' : ''}
                                        `}
                            onClick={(e) => handleClick(e, item)}>
                            <span>{item.name}</span>
                            <CloseButton name="X" type="group" item={item.name} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ChatGroupsList