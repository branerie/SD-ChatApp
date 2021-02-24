import React from 'react'
import styles from './index.module.css'


const MenuButton = ({ 
    title, 
    onClick, 
    disabled, 
    style, 
    btnType = 'default', 
    btnSize = 'medium', 
    isSubmit = false 
}) => {
    return (
        <button 
            type={isSubmit ? 'submit' : 'button'} 
            onClick={onClick} 
            className={`${styles[btnType]} ${styles.button} ${styles[btnSize]}`}
            style={style}
            disabled={disabled}
        >
            {title}
        </button>
    )
}

export default MenuButton