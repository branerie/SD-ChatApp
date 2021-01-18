import React from 'react'
import {useHistory} from 'react-router-dom'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import HomePageNavigation from '../HomePageNavigation'

const PageHeader = () => {
    const history = useHistory()
    const goToHomePage = () => {
        history.push('/')
    }
    return (
        <header className={styles['login-header']}>
            <img src={logo} alt="Smart chat logo" onClick={()=>{goToHomePage()}}/>
            <HomePageNavigation />
        </header>
    )
}

export default PageHeader