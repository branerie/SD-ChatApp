import React, { useState } from 'react'
import styles from './index.module.css'

const Input = ({ label, value, onChange, type }) => {

    return (
        <div className={styles['form-control']}>
            <label>
                {label}
                <div>
                    <input type={type || 'text'} className={styles.input} value={value} onChange={onChange} placeholder={`${label}...`}/>
                </div>
            </label>
        </div>
    )
}

export default Input