import { useContext } from 'react'
import css from './index.module.css'

import ListHeader from '../Common/ListHeader'
import ListItems from '../Common/ListItems'

import Project from './Project'

import { MessagesContext } from '../../context/MessagesContext'

const ProjectsList = () => {
    const { userData } = useContext(MessagesContext)

    const sites = Object.entries(userData.sites).sort((A, B) => {
        // Sort: own projects alphabetically first, then the rest alphabetically
        return (B[1].creator === userData.personal._id) - (A[1].creator === userData.personal._id) ||
            A[1].name.localeCompare(B[1].name)
    })

    return (
        <div className={`${css.container} ${css[userData.listSize]}`}>
            <ListHeader title={`projects (${sites.length})`} />
            <ListItems>{sites.map(([id, site]) =>
                <Project
                    key={id}
                    sid={id}
                    size={userData.listSize}
                    owner={site.creator === userData.personal._id}
                    requests={site.requests?.length}
                    messages={Object.values(site.groups).filter(group => group.unread).length}
                    logo={site.logo}
                    name={site.name}
                />
            )}
            </ListItems>
        </div>
    )
}

export default ProjectsList
