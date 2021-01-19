import React, { useContext, useState } from 'react'
import styles from './index.module.css'
import ProjectCircle from '../ProjectCircle'
import AvatarColors from '../../../../context/AvatarColors'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'

const ProjectCircleBox = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const [joinSite, setJoinSite] = useState()
    const [newSite, setNewSite] = useState()

    function handleClick(e, site) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-site", payload: { site } })
    }

    function requestJoin() {
        socket.emit("request-join", { site: joinSite }, (success, data) => {
            if (success) {
                dispatchUserData({ type: 'request-join', payload: { data } })
            } else {
                // if (data === "Already there") context.changeWindow(groupName, true)
                // else console.log(data)
            }
        })
    }

    if (!userData) return null //<div>Loading...</div>
    const sites = Object.entries(userData.sites).sort((A, B) => {
        // default sort: user sites first, then alphabetically
        return (B[1].creator === userData.personal._id) - (A[1].creator === userData.personal._id) || A[1].name.localeCompare(B[1].name)
    })

    return (
        <AvatarColors >
            <ul className={styles['project-circle-box']}>
                {sites.map(site => {
                    const classList = []
                    if (site[0] === userData.activeSite) classList.push("selected")
                    if (site[1].creator === userData.personal._id) classList.push("owner")
                    // if (context.newMessages[site] && site !== context.userData.activeGroup) classList.push("new-messages")
                    return (
                        <li key={site[0]} className={styles['list']} onClick={(e) => handleClick(e, site[0])}>
                            <ProjectCircle name={site[1].name}  />
                        </li>

                        // <li key={site[0]}
                        //     className={classList.join(" ")}
                        //     onClick={(e) => handleClick(e, site[0])}>
                        //     <span>{site[1].name}</span>
                        // </li>
                    )
                })}
            </ul>
        </AvatarColors>
    )
}

export default ProjectCircleBox
