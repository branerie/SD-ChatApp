import React, { useContext, useState } from 'react'
import styles from './index.module.css'
import ProjectCircle from '../ProjectCircle'
import AvatarColors from '../../../../context/AvatarColors'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'

const colors = [styles.red, styles.green, styles.blue, styles.orange]

const ProjectCircleBox = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const [joinSite, setJoinSite] = useState()
    let colorIndex = 0

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

    function addClasses(site){
        const classList = [styles.list]
        if (site[0] === userData.activeSite) classList.push(styles.selected)
        if (site[1].creator === userData.personal._id) classList.push(styles.owner)
        // if (context.newMessages[site] && site !== context.userData.activeGroup) classList.push("new-messages")

        if (classList.length === 1) {
            const currentColorIndex = colorIndex % colors.length
            const currentColor = colors[currentColorIndex]
            classList.push(currentColor)
        }
        
        colorIndex++

        return classList.join(' ')
    }

    return (
        // <AvatarColors >
            <div className={styles['project-circle-box']}>
                {sites.map(site => {
                    return (
                        <div 
                            key={site[0]}
                            className={addClasses(site)}
                            onClick={(e) => handleClick(e, site[0])}>
                            {site[1].name}
                        </div>
                    )
                })}
            </div>
        // </AvatarColors>
    )
}

export default ProjectCircleBox
