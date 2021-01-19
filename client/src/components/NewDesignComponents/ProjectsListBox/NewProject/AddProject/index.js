import React, { useState } from 'react'
import styles from './index.module.css'


const AddProject = () => {
    const [projectName, setProjectName] = useState('')
    return (
        <div className={styles['window']}>
            <form type="text" className={styles['form']} onSubmit={() => { }}>
                <input
                    className={styles['input']}
                    placeholder="Enter project name..."
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                /> <br/>
                <button className={styles['button']}>Create Project</button>
            </form>
        </div>
    )
}

export default AddProject
