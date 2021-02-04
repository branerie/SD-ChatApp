import React from 'react'
import styles from './index.module.css'
import { AuthenticateUser } from '../../../../context/authenticationContext'


const StatusLight = (props) => {
    const { logOut } = AuthenticateUser()
    return (
        <div 
            className={`${styles.circle} ${styles[props.color]} ${styles[props.size]}`} 
            onClick={()=>{logOut()}}
        />
    )
}

export default StatusLight
