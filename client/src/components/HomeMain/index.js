import React from 'react'
import styles from './index.module.css'
import LoginButton from '../Buttons/HomePageButton'
import { useHistory } from 'react-router-dom'

const HomeMain = () => {
    const history = useHistory()
    const goToLoginPage = () => {
        history.push('/login')
    }
    const goToRegisterPage = () => {
        history.push('/register')
    }


    return (
        <div className={styles['home-container']}>
            <LoginButton handleClick={goToLoginPage} title='Login' />
            <LoginButton handleClick={goToRegisterPage} title='Register' />

        </div>
    )
}

export default HomeMain
