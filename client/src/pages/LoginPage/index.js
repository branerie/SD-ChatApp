import React from 'react'
import styles from './index.module.css'
import LoginHeader from '../../components/LoginHeader2'
import LoginMain from '../../components/LoginMain2'


const LoginPage = () => {
    return (
        <div className={styles['login-container']}>
            <LoginHeader />
            <LoginMain />         
        </div>
    )
}

export default LoginPage
