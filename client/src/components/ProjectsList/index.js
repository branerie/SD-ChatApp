import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../context/MessagesContext'

const colors = [styles.red, styles.green, styles.blue, styles.orange]

const ProjectsList = ({ isSmallList }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    let colorIndex = 0

    function handleClick(e, site) {
        if (e.target.nodeName === 'BUTTON') return
        dispatchUserData({ type: "load-site", payload: { site } })
    }

    const sites = Object.entries(userData.sites).sort((A, B) => {
        // Sort: own projects alphabetically first, then the rest alphabetically
        return (B[1].creator === userData.personal._id) - (A[1].creator === userData.personal._id) || A[1].name.localeCompare(B[1].name)
    })

    function avatarLetter(line) {
        const splitedName = line.split(' ')
        const firstLatterArray = []
        for (let i = 0; i < splitedName.length; i++) {
            firstLatterArray.push(splitedName[i].charAt(0).toUpperCase())
        }
        const renderLetter = firstLatterArray.join('')
        return renderLetter

    }

    function addClasses(site) {
        const classList = [styles.list]
        if (site[0] === userData.activeSite) classList.push(styles.selected)
        if (site[1].creator === userData.personal._id) classList.push(styles.owner)
        if (classList.length === 1) {
            const currentColorIndex = colorIndex % colors.length
            const currentColor = colors[currentColorIndex]
            classList.push(currentColor)
        }

        classList.push(isSmallList ? styles['small-list'] : styles['large-list'])

        colorIndex++

        return classList.join(' ')
    }

    return (
        <div className={`${styles['project-box']} ${isSmallList ? styles['project-box-sm'] : styles['project-box-lg']}`}>
            <div className={styles['project-title']}>Projects</div>
            { isSmallList
                ?
                <div className={styles['project-container']}>
                    {sites.map(site => {
                        return (
                            <div
                                key={site[0]}
                                className={addClasses(site)}
                                onClick={(e) => handleClick(e, site[0])}>
                                {avatarLetter(site[1].name)}
                            </div>
                        )
                    })}
                </div>
                :
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
            }
        </div>
    )
}

export default ProjectsList
