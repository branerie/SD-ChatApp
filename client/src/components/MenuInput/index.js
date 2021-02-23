import React from 'react'
import styles from './index.module.css'

const MenuInput = ({ type, value, onChange, placeholder, disabled }) => {
    return (
        <input 
            type={type || 'text'}
            className={styles.input} 
            value={value}
            disabled={disabled || false}
            onChange={onChange} 
            placeholder={placeholder}
        />
    )
}

export default MenuInput