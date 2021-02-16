import { useContext, useState } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../context/MessagesContext'
import { SocketContext } from '../../../../context/SocketContext'
import Friend from '../../SelectedProjectBox/Friend'

const SearchPeople = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)

    const limit = 5
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
                setCursor(cursor + limit)
            })
        } else {
            setPage(page + 1)
            setCursor(cursor + limit)
        }
    }

    function prevPage() {
        setError(false)
        if (page > 1) {
            setPage(page - 1)
            setCursor(cursor - limit)
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
                <p>Search for people and send invitations</p>
                <input
                    className={styles.input}
                    type='text'
                    placeholder='Search by username, full name or email...'
                    onChange={e => changeSearch(e)} />
            </div>
            <button disabled={page >= 1} className={styles['form-btn']} onClick={searchPeople}>Search</button>
            {error && <p><small>{error}</small></p>}
            {page > 0 &&
                <ul>
                    {names.length >= 5 &&
                        <div>
                            <button disabled={page <= 1} onClick={prevPage}>&lt;&lt;</button>
                            <button disabled={!!error} onClick={nextPage}>&gt;&gt;</button>
                        </div>
                    }
                    {names.slice(cursor, cursor + limit).map(name => {
                        return (
                            <div key={name._id}>
                                <li>
                                    <Friend
                                        name={name.name}
                                        id={name._id}
                                        picturePath={name.picture}
                                    />
                                    <div>
                                        <button onClick={() => inviteMember(name.username)}>Invite</button>
                                        <button onClick={() => showMemberInfo(name)}>{showInfo[name._id] ? 'Less' : 'More'}</button>
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
            <hr />
        </div>
    )
}

export default SearchPeople
