import styles from './index.module.css'
import { useHistory } from 'react-router-dom'
import picture from '../../images/homePagePicture.png'

const HomeMain = () => {
    const history = useHistory()

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>HAVE YOUR BEST SMART CHAT</h1>
                <p>Chat with your teams fast, easy and unlimited.</p>
                <button className={styles.login} onClick={() => history.push('/login')} >Login</button>
                <button onClick={() => history.push('/register')} >Sign up</button>
            </div>
            <div className={styles.img}>
                <img src={picture} alt="Home page" />
            </div>
        </div>
    )
}

export default HomeMain
