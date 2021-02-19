import styles from './index.module.css'
import { useHistory } from 'react-router-dom'
import picture from '../../images/homePagePicture.png'

const HomeMain = () => {
    const history = useHistory()

    return (
        <div className={styles.container}>
            <div>
                <h1>HAVE YOUR BEST SMART CHAT</h1>
                <p>Chat with your teams fast, easy and unlimited.</p>
                <button onClick={() => history.push('/try')} >Try It Now</button>
            </div>
            <div>
                <img src={picture} alt="Home page" />
            </div>
        </div>
    )
}

export default HomeMain
