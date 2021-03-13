import { useContext, useState, useEffect } from 'react'
import styles from './index.module.css'
import { MessagesContext } from '../../../context/MessagesContext'
import MenuInput from '../../MenuInput'
import MenuButton from '../../Buttons/MenuButton'
import SeparatingLine from '../../SeparatingLine'

const BasicSettings = () => {
    const { userData } = useContext(MessagesContext)
    const [description, setDescription] = useState('')

    useEffect(() => {
        setDescription(userData.sites[userData.activeSite].description || '')
    }, [userData.activeSite])

    function updateDescription() { //todo
        // emit event, update db, update ui
    }

    return (
        <>
        <div className={styles['menu-field']}>
            <label className={styles['form-control']}>
                Update project description
                <MenuInput
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder='Project description...'
                />
            </label>
            <MenuButton
                title='Update'
                btnType='submit'
                btnSize='small'
                onClick={updateDescription}
                disabled={description === userData.sites[userData.activeSite].description || !description}
            />
        </div>
        <SeparatingLine horizontal={true} />
        </>
    )
}

export default BasicSettings
