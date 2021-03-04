import React from 'react'
import styles from './index.module.css'
import { ReactComponent as Search } from '../../../icons/search-projects.svg'
import { ReactComponent as Back } from '../../../icons/back.svg'
import { ReactComponent as Forward } from '../../../icons/forward.svg'
import { ReactComponent as Cancel } from '../../../icons/ban.svg'
import { ReactComponent as Accept } from '../../../icons/check-circle.svg'
import { ReactComponent as Info } from '../../../icons/info.svg'
import { ReactComponent as Save } from '../../../icons/save.svg'
import { ReactComponent as Open } from '../../../icons/folder-open.svg'

const icons = {
    accept: <Accept />,
    back: <Back />,
    cancel: <Cancel />,
    forward: <Forward />,
    info: <Info />,
    open: <Open />,
    save: <Save />,
    search: <Search />,
}

const MenuButton = ({ 
    title, 
    onClick, 
    disabled, 
    style,
    icon,
    btnType = 'default', 
    btnSize = 'medium',
    isSubmit = false, 
}) => {
    return (
        <button 
            type={isSubmit ? 'submit' : 'button'} 
            onClick={onClick} 
            className={`${styles[btnType]} ${styles.button} ${styles[btnSize]} ${icon && styles.resize}`}
            style={style}
            disabled={disabled}
        >
            <span>{title}</span>
            <i title={title}>{icons[icon]}</i>
        </button>
    )
}

export default MenuButton