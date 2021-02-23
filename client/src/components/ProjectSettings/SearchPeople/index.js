import { useContext, useState } from 'react'
import styles from './index.module.css'
import SmallButton from '../../Buttons/SmallButton'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import UserAvatar from '../../Common/UserAvatar'
import MenuInput from '../../MenuInput'
import MenuButton from '../../Buttons/MenuButton'

const LIMIT = 5

const SearchPeople = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)

    const [name, setName] = useState()
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
                setError("No results found")
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

    function inviteMember(user) {
        let site = userData.activeSite
        socket.emit("send-invitation", { user, site }, (success, user) => {
            if (success) dispatchUserData({ type: 'add-user-to-site-invitations', payload: { user, site } })
        })
    }

    function showMemberInfo(member) {
        setShowInfo({
            ...showInfo,
            [member._id]: !showInfo[member._id]
        })
    }

    return (
        <div className={styles['menu-field']}>
            <div className={styles['form-control']} >
                Search for people and send invitations
                <MenuInput
                    value={name}
                    onChange={e => changeSearch(e)}
                    placeholder='Search by username, full name or email...'
                />
            </div>
            <div className={styles['btn-search']}>
                <MenuButton
                    title='Search'
                    disabled={page >= 1}
                    onClick={searchPeople}
                    disabled={!name}
                />
            </div>
            {error && <p><small>{error}</small></p>}
            {page > 0 &&
                <ul>
                    {names.length >= 5 &&
                        <div>
                            <button disabled={page <= 1} onClick={prevPage}>&lt;&lt;</button>
                            <button disabled={!!error} onClick={nextPage}>&gt;&gt;</button>
                        </div>
                    }
                    {names.slice(cursor, cursor + LIMIT).map(name => {
                        return (
                            <div key={name._id}>
                                <li className={styles['list-item']}>
                                    <div className={styles.card}>
                                        <UserAvatar picturePath={name.picture} />
                                        <span>{name.name}</span>
                                    </div>
                                    <div>
                                        <SmallButton onClick={() => inviteMember(name.username)} title='Invite' />
                                        <SmallButton onClick={() => showMemberInfo(name)} title={showInfo[name._id] ? 'Less' : 'More'} />
                                    </div>
                                </li>
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
    )
}

export default SearchPeople
