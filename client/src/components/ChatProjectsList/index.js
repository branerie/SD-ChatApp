import React, { useContext, useState } from 'react'
import "./index.css"
import { MessagesContext } from '../../context/MessagesContext'
import { SocketContext } from '../../context/SocketContext'


const ChatProjectsList = () => {
    const { socket } = useContext(SocketContext)
    const {userData, dispatchUserData } = useContext(MessagesContext)
    const [joinSite, setJoinSite] = useState()
    const [newSite, setNewSite] = useState()

    function handleClick(e, site) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-site", payload: { site } })
    }

    function sendRequest() {
        socket.emit("send-request", joinSite , (success, siteData) => {
            if (success) {
                dispatchUserData({ type: 'add-site-to-requests', payload: { siteData } })
            } else {
                // if (data === "Already there") context.changeWindow(groupName, true)
                // else console.log(data)
            }
        })
    }

    function createSite() {
        socket.emit("create-site", newSite, (success, siteData) => {
            if (success) {
                dispatchUserData({ type: 'create-site', payload: { siteData, activeConnection: true } })
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
                <input onChange={e => setJoinSite(e.target.value)} />
                <button className="join-btn" onClick={sendRequest}>Join</button>
            </div>
            <h2>SITES</h2>
            <div>
                <input onChange={e => setNewSite(e.target.value)} />
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