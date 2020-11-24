import React from 'react'
import styles from './index.module.css'
import PageHeader from  '../../components/PageHeader'
import HomeMain from  '../../components/HomeMain'

const HomePage = () => {
    return (
        <div className={styles['home-container']}>   
            <PageHeader text='Welcome to ChatApp'/>
            <HomeMain />
        </div>
    )
}

export default HomePage