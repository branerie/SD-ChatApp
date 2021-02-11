import { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const SearchProjects = () => {
    const limit = 5
    const [site, setSite] = useState('')
    const [sites, setSites] = useState([])
    const [error, setError] = useState(false)
    const [page, setPage] = useState(0)
    const [cursor, setCursor] = useState(0)
    const [showInfo, setShowInfo] = useState({})
    const { socket } = useContext(SocketContext)
    const { dispatchUserData } = useContext(MessagesContext)


    function searchProjects() {
        socket.emit('search-projects', { site, page }, (success, data) => {
            if (success) {
                setSites(data)
            } else {
                setError("No results found")

            }
                       
            setPage(page + 1)
        })
    }

    function changeSearch(e) {
        setSite(e.target.value)
        setPage(0)
        setCursor(0)
        setError(false)
        setSites([])
        setShowInfo({})
    }

    function nextPage() {
        if (sites.length / page <= 5) {
            socket.emit('search-projects', { site, page }, (success, data) => {
                success ? setSites([...sites, ...data]) : setError("No more results")
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

    function sendRequest(siteID) {
        socket.emit("send-request", siteID, (success, siteData) => {
            if (success) {
                dispatchUserData({ type: 'add-site-to-requests', payload: { siteData } })
            }
        })
    }

    function showProjectInfo(site) {
        setShowInfo({
            ...showInfo,
            [site._id]: !showInfo[site._id]
        })
    }

    return (
        <div className={styles['menu-field']}>
            <h3>Find project</h3>
            <div className={styles['form-control']}>
                <input className={styles.input} type="text" placeholder='Project name...' onChange={e => changeSearch(e)} />
            </div>
            <button disabled={page >= 1} className={styles['form-btn']} onClick={searchProjects}>Search</button>
            {error && <p><small>{error}</small></p>}
            {page > 0 &&
                <ul>
                    {sites.length >= 5 &&
                        <div>
                            <button disabled={page <= 1} onClick={prevPage}>&lt;&lt;</button>
                            <button disabled={!!error} onClick={nextPage}>&gt;&gt;</button>
                        </div>
                    }
                    {sites.slice(cursor, cursor + limit).map(site => {
                        return (
                            <div>

                                <li key={site._id}>
                                    <span>{site.name}</span>
                                    <div>
                                        <button onClick={() => sendRequest(site.name)}>Join</button>
                                        <button onClick={() => showProjectInfo(site)}>{showInfo[site._id] ? 'Less' : 'More'}</button>
                                    </div>
                                </li>
                                {showInfo[site._id] &&
                                    <div>
                                        <p><small>Owner: {site.creator.name}</small></p>
                                        {site.createdAt && <p><small>Created on: {new Date(site.createdAt).toDateString()}</small></p>}
                                        {site.description && <p><small>Description: {site.description}</small></p>}
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

export default SearchProjects
