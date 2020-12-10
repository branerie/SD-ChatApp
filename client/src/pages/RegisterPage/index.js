import React from 'react'
import styles from './index.module.css'
import PageHeader from '../../components/PageHeader'
import RegisterMain from '../../components/RegisterMain'

const RegisterPage = () => {
    return (
        <div className={styles['register-container']}>
            <PageHeader />
            <RegisterMain />
        </div>
    )
}

export default RegisterPage