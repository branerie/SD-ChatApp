import { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../../../context/MessagesContext'
import { SocketContext } from '../../../../../context/SocketContext'

const SearchProjects = () => {
    const [site, setSite] = useState('')
    const [sites, setSites] = useState([])
    const [error, setError] = useState(false)
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)


    function searchProjects() {
        socket.emit('search-projects', { site }, (success, data) => {
            if (success) {
                setError(false)
                setSites(data)
            } else {
                setError(data)
                setSites([])
            }
        })
    }

    function sendRequest(siteID) {
        socket.emit("send-request", siteID , (success, siteData) => {
            if (success) {
                dispatchUserData({ type: 'add-site-to-requests', payload: { siteData } })
            }
        })
    }

    function showProjectInfo(siteID) {
        console.log(siteID);
    }

    return (
        <div className={styles['menu-field']}>
            <h3>Find project</h3>
            <div className={styles['form-control']}>
                <input className={styles.input} type="text" placeholder='Project name...' onChange={e => setSite(e.target.value)} />
            </div>
            <button className={styles['form-btn']} onClick={searchProjects}>Search</button>
            {error && <p><small>{error}</small></p>}
            {sites.length > 0 && <ul>
                {sites.map(site => {
                    return (
                        <li key={site._id}>
                            <span>{site.name}</span>
                            <div>
                                <button onClick={() => sendRequest(site.name)}>Join</button>
                                <button onClick={() => showProjectInfo(site._id)}>Info</button>
                            </div>
                        </li>
                    )
                })}
            </ul>}
        </div>
    )
}

export default SearchProjects
