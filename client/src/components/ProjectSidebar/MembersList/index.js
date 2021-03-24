import { useContext } from 'react'
import css from './index.module.css'
import Member from './Member'
import ListHeader from '../../Common/ListHeader'
import ListItems from '../../Common/ListItems'

import { MessagesContext } from '../../../context/MessagesContext'

const MembersList = () => {
    const { userData } = useContext(MessagesContext)

    let owner = userData.sites[userData.activeSite].creator
    let members = userData.sites[userData.activeSite].groups[userData.activeGroup].members.sort((a, b) => {
        // SORT: owner on top, then online members alphabetical, then offline members alphabetical
        let A = userData.associatedUsers[a]
        let B = userData.associatedUsers[b]
        return (b === owner) - (a === owner) || B.online - A.online || A.name.localeCompare(B.name)
    })

    return (
        <div className={css.container}>
            <ListHeader title={`members (${members.length})`} />
            <ListItems>
                {members.map(member =>
                    <Member
                        key={member}
                        id={member}
                        name={userData.associatedUsers[member].name}
                        picturePath={userData.associatedUsers[member].picture}
                        isOnline={userData.associatedUsers[member].online}
                    />
                )}
            </ListItems>
        </div>
    )
}

export default MembersList
