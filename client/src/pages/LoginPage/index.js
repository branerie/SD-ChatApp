import React from 'react'
import styles from './index.module.css'
import LoginHeader from '../../components/LoginHeader'
import LoginMain from '../../components/LoginMain'


const LoginPage = () => {
    return (
        <div className={styles['login-container']}>
            <LoginHeader />
            <LoginMain />         
        </div>
    )
}

export default LoginPage
