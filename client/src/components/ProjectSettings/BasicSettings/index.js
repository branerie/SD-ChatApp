import { useContext, useState, useEffect } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import { SocketContext } from '../../../context/SocketContext'
import MenuInput from '../../MenuInput'
import MenuButton from '../../Buttons/MenuButton'
import ProjectLogo from './ProjectLogo'
import SeparatingLine from '../../SeparatingLine'

const BasicSettings = () => {
    const { userData, dispatchUserData } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    const [site, setSite] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState([])

    useEffect(() => {
        setErrors([])
        setSite(userData.sites[userData.activeSite].name || '')
        setDescription(userData.sites[userData.activeSite].description || '')
    }, [userData])

    function changeName(e) {
        setErrors([])
        setSite(e.target.value)
    }

    function changeDescription(e) {
        setErrors([])
        setDescription(e.target.value)
    }

    function updateProjectSettings() { //todo
        const logo = userData.sites[userData.activeSite].logo || ''
        socket.emit('update-project-settings', { sid: userData.activeSite, site, description, logo }, (success, data) => {
            if (success) dispatchUserData({ type: 'update-project-settings', payload: { data } })
            else setErrors([...errors, data])
        })
    }

    return (
        <>
            <div className={styles.container}>
                <ProjectLogo />
                <div className={styles['menu-field']}>
                    <div className={styles['form-control']}>
                        <p>Name</p>
                        <MenuInput
                            value={site}
                            onChange={e => changeName(e)}
                            placeholder='Name...'
                        />
                    </div>
                    <div className={styles['form-control']}>
                        <p>Description</p>
                        <MenuInput
                            value={description}
                            onChange={e => changeDescription(e)}
                            placeholder='Description...'
                        />
                    </div>
                    <MenuButton
                        title='Update'
                        btnType='submit'
                        btnSize='small'
                        onClick={updateProjectSettings}
                        disabled={site === userData.sites[userData.activeSite].name && description === userData.sites[userData.activeSite].description}
                    />
                    {errors.length > 0 &&
                        <ul className={styles.errors}>
                            {errors.map((error, index) => {
                                return <li key={index}><small>{error}</small></li>
                            })}
                        </ul>
                    }
                </div>
            </div>
            <SeparatingLine horizontal={true} />
        </>
    )
}

export default BasicSettings
