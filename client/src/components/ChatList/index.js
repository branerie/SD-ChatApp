import React, { useContext, useEffect, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'

import CloseButton from '../Buttons/CloseButton'

const ChatList = () => {
    const { socket } = useContext(SocketContext)
    const context = useContext(MessagesContext)
    const [groupName, setGroupName] = useState()
    const [siteName, setSiteName] = useState()
    const [siteClicked, setSiteClicked] = useState()

    useEffect(() => {
        setSiteClicked(Object.keys(context.sites)[0])
    },[context.sites])

    function handleClick(e, item, isGroup) {
        if (e.target.nodeName === 'BUTTON') return
        context.changeWindow(item, isGroup)
        // if group fetch userlist and messages from server and set state for first request complete
        // if chat fetch chat messages from server and set state for first request complete
    }

    function handleClickSite(e, item) {
        if (e.target.nodeName === 'BUTTON') return
        context.changeWindow(context.sites[item][0]._id)
        context.setGroups([...context.sites[item]])
        setSiteClicked(item)
    }

    function joinGroup() {
        socket.emit("join-request", { group: groupName }, (success, data) => {
            if (success) {
                context.setGroups(oldGroups => [...oldGroups, groupName])
                context.changeWindow(groupName, true)
                context.dispatchGroupMembers({ type: 'load-new-group-users', payload: { group: groupName, data } })
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
                context.dispatchGroupMembers({ type: 'load-new-group-users', payload: { group: groupName, data } })
                context.dispatchMessages({ type: "join-request-message", payload: { group: groupName } })
            } else {
                if (data === "You are already there.") context.changeWindow(groupName, true)
                else console.log(data)
            }
        })
    }

    function createSite() {
        socket.emit("create-site", { site: siteName }, (success, data) => {
            if (success) {
                context.setSites({ ...context.sites, [siteName]: [{_id: data._id , name: data.name}] })
                context.setGroups([{_id: data._id , name: data.name}])
                setSiteClicked(siteName)
                context.changeWindow(data._id, true)
                context.dispatchGroupMembers({ type: 'load-new-group-users', payload: { group: siteName, data } })
                context.dispatchMessages({ type: "join-request-message", payload: { group: siteName } })
            } else {
                if (data === "You are already there.") context.changeWindow(siteName, true)
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
                <div>
                <input onChange={e => setSiteName(e.target.value)}/>
                <button className="join-btn" onClick={createSite}>New</button>
                </div>
                <h2>SITES</h2>
                <ul>
                    {Object.keys(context.sites).map((item, i) => {
                        return (
                            <li key={`group${i}`}
                                className={`
                                        ${item === siteClicked ? "selected" : ""} 
                                        ${(context.newMessages[item] && item !== context.activeWindow) ? 'new-messages' : ''}
                                        `}
                                onClick={(e) => handleClickSite(e,item)}>
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
