import React, { useContext, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'

const ChatList = ({ label, data }) => {
    const [selected, setSelected] = useState("STATUS")
    const context = useContext(MessagesContext)

    function handleClick(item, isGroup) {
        context.changeWindow(item, isGroup)
        setSelected(item)
        // if group fetch userlist and messages from server and set state for first request complete
        // if chat fetch chat messages from server and set state for first request complete
    }
    return (
        <aside className="chat-sidebar">
            <div>
                <h2>GROUPS</h2>
                <ul>
                    {context.groups.map((item, i) => {
                        return <li
                            key={`group${i}`}
                            className={selected === item ? "selected" : null}
                            onClick={() => handleClick(item, item !== "STATUS")}
                        >{item}</li>
                    })}
                </ul>
                <h2>CHATS</h2>
                <ul>
                    {context.chats.map((item, i) => {
                        return <li
                            key={`chat${i}`}
                            className={selected === item ? "selected" : null}
                            onClick={() => handleClick(item, false)}
                        >{item}</li>
                    })}
                </ul>
            </div>
        </aside>
    )
}

export default ChatList
