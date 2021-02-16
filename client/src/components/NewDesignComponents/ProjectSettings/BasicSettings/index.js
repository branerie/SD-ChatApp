import { useContext, useState } from 'react'
import styles from './index.module.css'
import { MessagesContext } from "../../../../context/MessagesContext"

const BasicSettings = () => {
    const { userData } = useContext(MessagesContext)
    const [description, setDescription] = useState(userData.sites[userData.activeSite].description)

    function updateDescription() { //todo
        // emit event, update db, update ui
    }

    return (
        <div className={styles['menu-field']}>
            <div className={styles['form-control']} >
                <label htmlFor="a">Update project description</label>
                <input
                    className={styles.input}
                    type='text'
                    value={description}
                    placeholder='Project description...'
                    onChange={e => setDescription(e.target.value)} />
            </div>
            <button
                className={styles['form-btn']}
                onClick={updateDescription}
                disabled={description === userData.sites[userData.activeSite].description}
            >Update</button>
            <hr />
        </div>
    )
}

export default BasicSettings
