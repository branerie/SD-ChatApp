import { useState } from 'react'
import styles from './index.module.css'

const InputField = (props) => {

    const [value, setValue] = useState(props.value)

    return (
        <div className={styles['input-field']}>
            <label className={styles['label']}>{props.label}
                <div className={styles['input-container']}>
                    <input
                        className={styles['input']}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </div>
            </label>
        </div>
    )
}

export default InputField
