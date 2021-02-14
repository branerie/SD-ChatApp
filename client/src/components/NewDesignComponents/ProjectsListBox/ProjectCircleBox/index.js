import { useContext } from 'react'
import styles from './index.module.css'
// import AvatarColors from '../../../../context/AvatarColors'
import { MessagesContext } from '../../../../context/MessagesContext'

const colors = [styles.red, styles.green, styles.blue, styles.orange]

const ProjectCircleBox = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    let colorIndex = 0

    function handleClick(e, site) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-site", payload: { site } })
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
                <div className={styles['project-title']}>Projects List</div>
                <div className={styles['project-container']}>
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
            </div>
        // </AvatarColors>
    )
}

export default ProjectCircleBox
