import React from 'react'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import HomePageNavigation from '../HomePageNavigation'

const PageHeader = () => {
    return (
        <header className={styles['login-header']}>
            <img src={logo} alt="Smart chat logo" />
            <HomePageNavigation />
        </header>
    )
}

export default PageHeader