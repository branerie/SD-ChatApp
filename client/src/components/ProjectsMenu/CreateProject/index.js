import { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'

const CreateProject = () => {
    const { socket } = useContext(SocketContext)
    const { dispatchUserData } = useContext(MessagesContext)
    const [errors, setErrors] = useState([])
    const [site, setSite] = useState('')
    const [description, setDescription] = useState('')

    function createSite() {
        socket.emit('create-site', { site, description }, (success, siteData) => {
            if (success) {
                dispatchUserData({ 
                    type: 'create-site', 
                    payload: { 
                        siteData, 
                        activeConnection: true 
                    }
                })
            } else {
                setErrors(siteData)
            }
        })
    }
    return (
        <div className={styles['menu-field']}>
            <h3>Create new project</h3>
            <div className={styles['form-control']}>
                <input className={styles.input} type='text' placeholder='Project name...' onChange={e => setSite(e.target.value)} />
            </div>
            <div className={styles['form-control']} >
                <input className={styles.input} type='text' placeholder='Project description...' onChange={e => setDescription(e.target.value)} />
            </div>
            <button onClick={createSite}>Create</button>
            {errors.length > 0 &&
                <ul className={styles.errors}>
                    {errors.map((error, index) => {
                        return <li key={index}><small>{error}</small></li>
                    })}
                </ul>
            }
        </div>
    )
}

export default CreateProject
