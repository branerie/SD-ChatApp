import React from 'react'
import styles from './index.module.css'

const LoginButton = (props) => {
    return (
        <button onClick={props.handleClick} className={styles.btn}>{props.title}</button>
    )
}

export default LoginButton
