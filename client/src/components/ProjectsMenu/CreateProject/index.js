import { useState, useContext } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import MenuInput from '../../MenuInput'
import MenuButton from '../../Buttons/MenuButton'

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
                <MenuInput 
                    value={site} 
                    type='text' 
                    onChange={e => setSite(e.target.value)} 
                    placeholder='Project name...'
                />
            </div>
            <div className={styles['form-control']}>
                <MenuInput 
                    value={description} 
                    type='text' 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder='Project description...'
                />
            </div>
            {/* <button onClick={createSite}>Create</button> */}
            <div className={styles.createbtn}>
                <MenuButton title='Create' onClick={createSite} disabled={!site} btnType='submit' />
            </div>
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
