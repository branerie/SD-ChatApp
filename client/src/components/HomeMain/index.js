import React from 'react'
import styles from './index.module.css'
import { useHistory } from 'react-router-dom'
import picture from '../../images/homePagePicture.png'

const HomeMain = () => {
    const history = useHistory()

    const goToTryPage = () => {
        history.push('/try')
    }


    return (
        <div className={styles['home-container']}>
            <div>
                <h1>HAVE YOUR BEST SMART CHAT</h1>
                <p>Chat with your teams fast, easy and unlimited.</p>
                <button className={styles['try-now-btn']} onClick={goToTryPage} >Try It Now</button>
            </div>
            <div>
                <img src={picture} alt="" />
            </div>
        </div>
    )
}

export default HomeMain
