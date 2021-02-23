import React from 'react'
import styles from './index.module.css'

const Checkbox = ({ isSelected, onClick, label }) => {
    const handleClick = () => {
        if (!isSelected) onClick()
    }

    return (
        <div className={`${styles.container} ${isSelected && styles.selected}`} onClick={handleClick}>
            {label}
            <span className={styles.outer}>
                <span className={`${styles.inner} ${isSelected && styles.selected}`}></span>
            </span>
        </div>

    )
}

export default Checkbox