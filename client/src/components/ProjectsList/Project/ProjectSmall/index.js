import { useContext } from 'react'
import css from '../index.module.css'

import ProjectAvatar from '../../../Common/ProjectAvatar'

import { MessagesContext } from '../../../../context/MessagesContext'

const ProjectSmall = ({ sid, owner, requests, messages, logo, name }) => {
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function loadProject(pid) {
        dispatchUserData({ type: 'load-site', payload: { site: pid } })
    }

    function setClasses(id, owner) {
        const classList = [css.card, css.small]
        classList.push(owner ? css.owner : css.guest)
        id === userData.activeSite && classList.push(css.selected)
        return classList.join(' ')
    }

    function setAbbreviation(string) {
        return string.split(' ', 3).map(word => word[0]).join('')
    }

    return (
        <div
            className={setClasses(sid, owner)}
            onClick={() => loadProject(sid)}>
            {logo ? <ProjectAvatar picturePath={logo} /> : setAbbreviation(name)}
        </div>
    )
}

export default ProjectSmall