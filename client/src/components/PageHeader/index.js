import React from 'react'
import styles from './index.module.css'

const PageHeader = (props) => {
    return (
        <header className={styles['login-header']}>
            <h1>{props.text}</h1>
        </header>
    )
}

export default PageHeader