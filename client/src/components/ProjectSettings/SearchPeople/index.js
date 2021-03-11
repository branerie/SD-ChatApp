import { useContext, useState } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import UserAvatar from '../../Common/UserAvatar'
import MenuInput from '../../MenuInput'
import MenuButton from '../../Buttons/MenuButton'
import SeparatingLine from '../../SeparatingLine'

const LIMIT = 5  

const SearchPeople = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)

    const [name, setName] = useState('')
    const [page, setPage] = useState(0)
    const [names, setNames] = useState([])
    const [error, setError] = useState(false)
    const [cursor, setCursor] = useState(0)
    const [showInfo, setShowInfo] = useState({})

    function searchPeople() {
        socket.emit('search-people', { name, page }, (success, data) => {
            if (success) {
                setNames(data)
            } else {
                setError(data)
            }
            setPage(page + 1)
        })
    }

    function changeSearch(e) {
        setName(e.target.value)
        setPage(0)
        setCursor(0)
        setError(false)
        setNames([])
        setShowInfo({})
    }

    function nextPage() {
        if (names.length / page <= 5) {
            socket.emit('search-people', { name, page }, (success, data) => {
                success ? setNames([...names, ...data]) : setError("No more results")
                setPage(page + 1)
                setCursor(cursor + LIMIT)
            })
        } else {
            setPage(page + 1)
            setCursor(cursor + LIMIT)
        }
    }

    function prevPage() {
        setError(false)
        if (page > 1) {
            setPage(page - 1)
            setCursor(cursor - LIMIT)
        }
    }

    function inviteMember(uid) {
        let sid = userData.activeSite
        socket.emit("send-invitation", { uid, sid }, (success, invitationData) => {
            if (!success) return
            
            dispatchUserData({ type: 'add-user-to-site-invitations', payload: { invitationData } })

            // const newNames = names.filter(n => n.username !== user)
            // setNames(newNames)
        })
    }

    function showMemberInfo(member) {
        setShowInfo({
            ...showInfo,
            [member._id]: !showInfo[member._id]
        })
    }

    const activeSite = userData.sites[userData.activeSite]

    return (
        <>
        <div className={styles['menu-field']}>
            <div className={styles['form-control']} >
                Search for people and send invitations
                <MenuInput
                    value={name}
                    onChange={e => changeSearch(e)}
                    placeholder='Search by username, full name or email...'
                />
            </div>
            <MenuButton
                title='Search'
                btnSize='medium'
                disabled={!name}
                onClick={searchPeople}
                style={{ float: 'right', marginBottom: '10px' }}
            />
            {error && <p><small>{error}</small></p>}
            {page > 0 &&
                <ul>
                    {names.length >= 5 &&
                        <div className={styles['nav-buttons']}>
                            <MenuButton 
                                btnSize='large'
                                disabled={page <= 1} 
                                onClick={prevPage} 
                                icon='back'
                                title='Previous Page'
                            />
                            <MenuButton 
                                btnSize='medium'
                                disabled={!!error} 
                                onClick={nextPage}
                                title='Next Page'
                                icon='forward'
                                style={{ marginLeft: '0.5rem' }} 
                            />
                        </div>
                    }
                    {names.slice(cursor, cursor + LIMIT).map(name => {
                        const cannotInvite = name._id === userData.personal._id ||
                                             (Object.values(activeSite.groups).some(g => g.members.includes(name._id))) || 
                                             (activeSite.invitations && activeSite.invitations.includes(name._id))

                        return (
                            <div key={name._id}>
                                <div className={styles['list-item']}>
                                    <div className={styles.card}>
                                        <UserAvatar picturePath={name.picture} />
                                        <span className={styles.name}>{name.name}</span>
                                    </div>
                                    <div className={styles.buttons}>
                                        <MenuButton 
                                            onClick={() => inviteMember(name._id)} 
                                            title='Invite'
                                            btnType='submit'
                                            btnSize='medium'
                                            icon='accept'
                                            disabled={cannotInvite}
                                        />
                                        <MenuButton 
                                            onClick={() => showMemberInfo(name)} 
                                            title={showInfo[name._id] ? 'Less' : 'More'}
                                            btnSize='medium'
                                            icon='info'
                                            style={{ marginLeft: '0.5rem' }}
                                         />
                                    </div>
                                </div>
                                {showInfo[name._id] &&
                                    <div>
                                        <p><small>Username: {name.username}</small></p>
                                        {name.company && <p><small>Company: {name.company}</small></p>}
                                        {name.position && <p><small>Position: {name.position}</small></p>}
                                    </div>
                                }
                            </div>
                        )
                    })}

                </ul>
            }
        </div>
        <SeparatingLine horizontal={true} />
        </>
    )
}

export default SearchPeople
