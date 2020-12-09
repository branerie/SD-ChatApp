import React from 'react'
import styles from './index.module.css'
import LoginButton from '../Buttons/HomePageButton'
import { useHistory } from 'react-router-dom'

const HomePageNavigation = () => {
    const history = useHistory()
    const goToLoginPage = () => {
        history.push('/login')
    }
    const goToRegisterPage = () => {
        history.push('/register')
    }
    const goToAboutPage = () => {
        history.push('/about')
    }
    const goToTryPage = () => {
        history.push('/try')
    }
    return (
        <nav className={styles['home-page-navigation']}>
            <LoginButton handleClick={goToAboutPage} title='Product' />
            <LoginButton handleClick={goToLoginPage} title='Login' />
            <LoginButton handleClick={goToRegisterPage} title='Register' />
            <LoginButton handleClick={goToTryPage} title='Try It Free' />
        </nav>
    )
}

export default HomePageNavigation
