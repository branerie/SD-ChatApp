import { useContext } from 'react'
import css from './index.module.css'

import ListHeader from '../Common/ListHeader'
import ProjectAvatar from '../Common/ProjectAvatar'
import Icon from '../Common/Icon'

import { MessagesContext } from '../../context/MessagesContext'

const ProjectsList = ({ isSmallList }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function loadProject(pid) {
        dispatchUserData({ type: 'load-site', payload: { site: pid } })
    }

    function loadProjectSettings(pid) {
        dispatchUserData({ type: 'load-project-settings', payload: { activeSite: pid } })
    }

    function loadProjectInfo(pid) {
        // todo: get project information
        console.log(pid)
    }

    const sites = Object.entries(userData.sites).sort((A, B) => {
        // Sort: own projects alphabetically first, then the rest alphabetically
        return (B[1].creator === userData.personal._id) - (A[1].creator === userData.personal._id) ||
            A[1].name.localeCompare(B[1].name)
    })

    function setAbbreviation(string) {
        return string.split(' ', 3).map(word => word[0]).join('')
    }

    function setClasses(id, owner) {
        const classList = [css.card]
        classList.push(isSmallList ? css.small : css.large)
        classList.push(owner ? css.owner : css.guest)
        id === userData.activeSite && classList.push(css.selected)
        return classList.join(' ')
    }

    return (
        <div className={`${css.container} ${isSmallList ? css.shrink : css.expand}`}>
            <ListHeader title={`projects (${sites.length})`}/>
            <div className={css.list}>
                {isSmallList
                    ? sites.map(([id, site]) => {
                        let owner = site.creator === userData.personal._id
                        return (
                            <div
                                key={id}
                                className={setClasses(id, owner)}
                                onClick={() => loadProject(id)}>
                                {site.logo ? <ProjectAvatar picturePath={site.logo} /> : setAbbreviation(site.name)}
                            </div>
                        )
                    })
                    : sites.map(([id, site]) => {
                        let owner = site.creator === userData.personal._id
                        let requests = site.requests?.length
                        let messages = Object.values(site.groups).filter(group => group.unread).length
                        return (
                            <div key={id} className={setClasses(id, owner)}>
                                <div className={css.title} onClick={() => loadProject(id)} >
                                    <ProjectAvatar picturePath={site.logo} />
                                    <div className={css.name}>{site.name}</div>
                                </div>
                                <div className={css.icons}>
                                    {messages > 0 && <Icon icon='msg' count={messages} onClick={() => loadProject(id)} />}
                                    {owner
                                        ? <Icon icon={requests > 0 ? 'bell' : 'gear'} count={requests} onClick={() => loadProjectSettings(id)} />
                                        : <Icon icon='info' onClick={() => loadProjectInfo(id)} />
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ProjectsList
