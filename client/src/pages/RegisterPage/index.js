import React from 'react'
import styles from './index.module.css'
import LoginHeader from '../../components/LoginHeader'
import RegisterMain from '../../components/RegisterMain'



const RegisterPage = () => {
    return (
        <div className={styles['register-container']}>
            <LoginHeader />
            <RegisterMain />
        </div>
    )
}

export default RegisterPage