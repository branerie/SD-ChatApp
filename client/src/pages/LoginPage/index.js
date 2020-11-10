import React from 'react'
import styles from './index.module.css'
import LoginHeader from '../../components/loginHeader'
import LoginMain from '../../components/loginMain'


const LoginPage = () => {
    return (
        <div className={styles['login-container']}>
            <LoginHeader />
            <LoginMain />         
        </div>
    )
}

export default LoginPage
