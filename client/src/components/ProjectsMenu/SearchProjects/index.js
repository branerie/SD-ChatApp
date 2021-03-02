import { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import MenuInput from '../../MenuInput'
import MenuButton from '../../Buttons/MenuButton'

const SearchProjects = () => {
    const limit = 5
    const [site, setSite] = useState('')
    const [sites, setSites] = useState([])
    const [error, setError] = useState(false)
    const [page, setPage] = useState(0)
    const [more, setMore] = useState(false)
    const [cursor, setCursor] = useState(0)
    const [showInfo, setShowInfo] = useState({})
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)

    function searchProjects() {
        socket.emit('search-projects', { site, page }, (success, more, data) => {
            success ? setSites(data) : setError(data)
            setMore(more)
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
        if (more) {
            socket.emit('search-projects', { site, page }, (success, more, data) => {
                if (success) setSites([...sites, ...data])
                setMore(more)
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

    function sendRequest(sid) {
        socket.emit("send-request", 'sid', (success, siteData) => {
            if (success) {
                dispatchUserData({ type: 'add-site-to-requests', payload: { siteData } })
            }
        })
    }

    function showProjectInfo(sid) {
        setShowInfo({
            ...showInfo,
            [sid]: !showInfo[sid]
        })
    }

    return (
        <div className={styles.container}>
            <h3>Find project</h3>
            <div className={styles.input}>
                <MenuInput disable={page >= 1} onChange={e => changeSearch(e)} placeholder='Project name...' />
            </div>

            <MenuButton
                title='Search'
                onClick={searchProjects}
                disabled={!site || sites.length || error}
                btnType='submit'
                btnSize='medium'
                style={{ float: 'right' }}
            />

            {error && <p><small>{error}</small></p>}
            {page > 0 &&
                <ul className={styles.results}>
                    {(more || sites.length > limit) &&
                        <div className={styles.buttons}>
                            <MenuButton
                                disabled={page <= 1}
                                onClick={prevPage}
                                title='Previous Page'
                                btnSize='large'
                            />
                            <MenuButton
                                disabled={!more && sites.length / page <= limit}
                                onClick={nextPage}
                                title='Next Page'
                                btnSize='medium'
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </div>
                    }
                    {sites.slice(cursor, cursor + limit).map(site => {

                        return (
                            <div key={site._id}>
                                <li className={styles.row}>
                                    <span>{site.name}</span>
                                    <div className={styles.buttons}>
                                        <MenuButton
                                            onClick={() => sendRequest(site._id)}
                                            title='Join'
                                            btnType='submit'
                                            btnSize='medium'
                                            disabled={userData.requests.find(r => r._id === site._id) || userData.sites[site._id]}
                                        />
                                        <MenuButton
                                            onClick={() => showProjectInfo(site._id)}
                                            title={showInfo[site._id] ? 'Less' : 'More'}
                                            btnSize='medium'
                                            style={{ marginLeft: '0.5rem' }}
                                        />
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
