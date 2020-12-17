import React, { useState, useContext } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'
import CloseButton from '../Buttons/CloseButton'

const ChatGroupsList = () => {
    const { socket } = useContext(SocketContext)
    const context = useContext(MessagesContext)
    const [groupName, setGroupName] = useState()

    function handleClick(e, item) {
        if (e.target.nodeName === 'BUTTON') return
        context.changeWindow(item._id, true)
        // if group fetch userlist and messages from server and set state for first request complete
        // if chat fetch chat messages from server and set state for first request complete
    }

    function addGroup() {
        // console.log('site:', context.activeSite,' group:', groupName);
        socket.emit("create-group", { site: context.activeSite, group: groupName }, (success, data) => {
            if (success) {
                context.setSites({ ...context.sites, [context.activeSite]: [...context.sites[context.activeSite], {_id: data._id , name: data.name}] })
                context.setGroups(oldGroups => [...oldGroups, {_id: data._id, name: groupName}])
                context.changeWindow(data._id, true)
                context.dispatchGroupMembers({ type: 'load-new-group-users', payload: { group: data, data } })
                context.dispatchMessages({ type: "join-request-message", payload: { group: data } })
            } else {
                if (data === "You are already there.") context.changeWindow(groupName, true)
                else console.log(data)
            }
        })
    }

    return (
        <div>
            <h2>groups: {context.groups.length}</h2>
            <div>
                <input onChange={e => setGroupName(e.target.value)} />
                <button className="join-btn" onClick={addGroup}>Add</button>
            </div>
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