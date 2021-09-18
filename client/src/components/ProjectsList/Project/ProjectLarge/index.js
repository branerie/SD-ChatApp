import { useContext } from 'react'
import css from '../index.module.css'

import ProjectAvatar from '../../../Common/ProjectAvatar'
import Icon from '../../../Common/Icon'

import { MessagesContext } from '../../../../context/MessagesContext'

const ProjectLarge = ({ sid, owner, requests, messages, logo, name }) => {
    const { userData , dispatchUserData} = useContext(MessagesContext)

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

    function setClasses(id, owner) {
        const classList = [css.card, css.large]
        classList.push(owner ? css.owner : css.guest)
        id === userData.activeSite && classList.push(css.selected)
        return classList.join(' ')
    }

    return (
        <div key={sid} className={setClasses(sid, owner)}>
            <div className={css.title} onClick={() => loadProject(sid)} >
                <ProjectAvatar picturePath={logo} />
                <div className={css.name}>{name}</div>
            </div>
            <div className={css.icons}>
                {messages > 0 && <Icon icon='msg' count={messages} onClick={() => loadProject(sid)} />}
                {owner
                    ? <Icon icon={requests > 0 ? 'bell' : 'gear'} count={requests} onClick={() => loadProjectSettings(sid)} />
                    : <Icon icon='info' onClick={() => loadProjectInfo(sid)} />
                }
            </div>
        </div>
    )
}

export default ProjectLarge