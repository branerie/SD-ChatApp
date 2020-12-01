import React, { useContext, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

import CloseButton from '../Buttons/CloseButton'

const ChatList = () => {
    const { socket } = useContext(SocketContext)
    const context = useContext(MessagesContext)
    const [groupName, setGroupName] = useState()

    function handleClick(e, item, isGroup) {
        if (e.target.nodeName === 'BUTTON') return
        context.changeWindow(item, isGroup)
        // if group fetch userlist and messages from server and set state for first request complete
        // if chat fetch chat messages from server and set state for first request complete
    }

    function joinGroup() {
        socket.emit("join-request", { group: groupName }, (success, data) => {
            if (success) {
                context.setGroups(oldGroups => [...oldGroups, groupName])
                context.changeWindow(groupName, true)
                context.dispatchGroupMembers({ type: 'loadUsers', payload: { groups: data } })
                context.dispatchMessages({ type: "join-request-message", payload: { group: groupName } })
            } else {
                if (data === "Already there") context.changeWindow(groupName, true)
                else console.log(data)
            }
        })
    }

    function addGroup() {
        socket.emit("create-group", { group: groupName }, (success, data) => {
            if (success) {
                context.setGroups(oldGroups => [...oldGroups, groupName])
                context.changeWindow(groupName, true)
                context.dispatchGroupMembers({ type: 'loadUsers', payload: { groups: data } })
                context.dispatchMessages({ type: "join-request-message", payload: { group: groupName } })
            } else {
                if (data === "Already there") context.changeWindow(groupName, true)
                else console.log(data)
            }
        })
    }
    return (
        <aside className="chat-sidebar">
            <div>
                <div>
                <input onChange={e => setGroupName(e.target.value)}/>
                <button className="join-btn" onClick={joinGroup}>Join</button>
                </div>
                <div>
                <input onChange={e => setGroupName(e.target.value)}/>
                <button className="join-btn" onClick={addGroup}>Add</button>
                </div>
                <h2>GROUPS</h2>
                <ul>
                    {context.groups.map((item, i) => {
                        return (
                            <li key={`group${i}`}
                                className={`
                                        ${item === context.activeWindow ? "selected" : ""} 
                                        ${(context.newMessages[item] && item !== context.activeWindow) ? 'new-messages' : ''}
                                        `}
                                onClick={(e) => handleClick(e,item, item !== "STATUS")}>
                                <span>{item}</span>
                                <CloseButton name="X" type="group" item={item}/>
                            </li>
                        )
                    })}
                </ul>
                <h2>CHATS</h2>
                <ul>
                    {context.chats.map((item, i) => {
                        return (
                            <li key={`chat${i}`}
                                className={`
                                    ${item === context.activeWindow ? "selected" : ""}
                                    ${context.newMessages[item] && item !== context.activeWindow ? 'new-messages' : ''}
                                    `}
                                onClick={(e) => handleClick(e,item, false)}>
                                <span>{item}</span>
                                <CloseButton name="X" type="chat" item={item}/>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </aside>
    )
}

export default ChatList
