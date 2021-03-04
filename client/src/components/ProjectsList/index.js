import { useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../context/MessagesContext'
import { ReactComponent as Gear } from '../../icons/gear.svg'
import { ReactComponent as Info } from '../../icons/info.svg'
import { ReactComponent as BellEmpty } from '../../icons/bell-empty.svg'
import { ReactComponent as BellFull } from '../../icons/bell-full.svg'
import { ReactComponent as MsgEmpty } from '../../icons/msg-empty.svg'
import { ReactComponent as MsgFull } from '../../icons/msg-full.svg'


const ProjectsList = ({ isSmallList }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function loadProject(site) {
        dispatchUserData({ type: "load-site", payload: { site } })
    }

    function projectSettings(pid) {
        dispatchUserData({ type: 'load-project-settings', payload: { activeSite: pid } })
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
        const classList = [styles.project]
        classList.push(site[1].creator === userData.personal._id ? styles.owner : styles.guest)
        classList.push(isSmallList ? styles.small : styles.large)
        site[0] === userData.activeSite && classList.push(styles.selected)
        return classList.join(' ')
    }

    return (
        <div className={`${styles.container} ${isSmallList ? styles.shrink : styles.expand}`}>
            <div className={styles.header}>Projects</div>
            { isSmallList
                ?
                <div className={styles.list}>
                    {sites.map(site => {
                        return (
                            <div
                                key={site[0]}
                                className={addClasses(site)}
                                onClick={() => loadProject(site[0])}>
                                {avatarLetter(site[1].name)}
                            </div>
                        )
                    })}
                </div>
                :
                <div className={styles.list}>
                    {sites.map(site => {
                        let owner = site[1].creator === userData.personal._id
                        return (
                            <div
                                key={site[0]}
                                className={addClasses(site)}                                
                            >
                                <div onClick={() => loadProject(site[0])} className={styles.title}>{site[1].name}</div>
                                <div className={styles.icons}>
                                    {Object.values(site[1].groups).some(group => group.unread === true)
                                        ? <MsgFull onClick={() => loadProject(site[0])} className={styles.full} />
                                        : <MsgEmpty onClick={() => loadProject(site[0])} className={styles.empty} />
                                    }
                                    {owner
                                        ? <>
                                            {site[1].requests && site[1].requests.length > 0
                                                ? <BellFull onClick={() => projectSettings(site[0])} className={styles.full} />
                                                : <BellEmpty onClick={() => projectSettings(site[0])} className={styles.empty} />}
                                            <Gear onClick={() => projectSettings(site[0])} />
                                        </>
                                        : <Info />
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default ProjectsList
