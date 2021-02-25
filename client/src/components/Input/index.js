import React from 'react'
import styles from './index.module.css'

const Input = ({ label, value, onChange, type, placeholder }) => {

    return (
        <div className={styles.container}>
            <label>
                {label}
                <div>
                    <input 
                        type={type || 'text'}
                        className={styles.input} 
                        value={value} 
                        onChange={onChange} 
                        placeholder={placeholder}
                    />
                </div>
            </label>
        </div>
    )
}

export default Input