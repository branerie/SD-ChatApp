import React from 'react'
import styles from './index.module.css'

const MenuButton = ({ title, onClick, disabled, style, btnType = 'default', isSubmit = false }) => {
    return (
        <button 
            type={isSubmit ? 'submit' : 'button'} 
            onClick={onClick} 
            className={`${styles[btnType]} ${styles.button}`}
            style={style}
            disabled={disabled}
        >
            {title}
        </button>
    )
}

export default MenuButton