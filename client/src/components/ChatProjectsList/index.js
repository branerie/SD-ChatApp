import React, { useContext, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'


const ChatProjectsList = () => {
    const { socket } = useContext(SocketContext)
    const {userData, dispatchUserData } = useContext(MessagesContext)
    const [groupName, setGroupName] = useState()
    const [siteName, setSiteName] = useState()

    function handleClick(e, site) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-site", payload: { site } })
    }

    function joinGroup() {
        socket.emit("join-request", { group: groupName }, (success, data) => {
            if (success) {
                // TODO: userDataReducer
                // context.setGroups(oldGroups => [...oldGroups, groupName])
                // context.changeWindow(groupName, true)
                // context.dispatchGroupMembers({ type: 'load-new-group-users', payload: { group: groupName, data } })
                // context.dispatchMessages({ type: "join-request-message", payload: { group: groupName } })
            } else {
                // if (data === "Already there") context.changeWindow(groupName, true)
                // else console.log(data)
            }
        })
    }

    function createSite() {
        socket.emit("create-site", { site: siteName }, (success, data) => {
            if (success) {
                dispatchUserData({ type: 'create-site', payload: { ...data } })
            } else {
                // if (data === "You are already there.") context.dispatchUserData({type: "load-site", payload: {site}})
                // else console.log(data)
            }
        })
    }

    if (!userData) return null //<div>Loading...</div>
    const sites = Object.entries(userData.sites).sort((A,B) => {
        // default sort: user sites first, then alphabetically
        return (B[1].creator === userData.personal._id) - (A[1].creator === userData.personal._id) || A[1].name.localeCompare(B[1].name)
    })

    return (
        <div>
            <div>
                <input onChange={e => setGroupName(e.target.value)} />
                <button className="join-btn" onClick={joinGroup}>Join</button>
            </div>
            <h2>SITES</h2>
            <div>
                <input onChange={e => setSiteName(e.target.value)} />
                <button className="join-btn" onClick={createSite}>New</button>
            </div>
            <ul>
                {sites.map(site => {
                    const classList = []
                    if (site[0] === userData.activeSite) classList.push("selected")
                    if (site[1].creator === userData.personal._id) classList.push("owner")
                    // if (context.newMessages[site] && site !== context.userData.activeGroup) classList.push("new-messages")
                    return (
                        <li key={site[0]}
                            className={classList.join(" ")}
                            onClick={(e) => handleClick(e, site[0])}>
                            <span>{site[1].name}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ChatProjectsList