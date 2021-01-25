import React from 'react'
import styles from './index.module.css'


const InputField = (props) => {
    return (
        <div className={styles['input-field']}>
            <img src={props.socialMediaIcon} className={styles['icon']} />
            <div className={styles['input-container']}>
                <input className={styles['input']} />
            </div>
        </div>
    )
}

export default InputField
