import { useHistory } from 'react-router-dom'
import styles from './index.module.css'
import logo from '../../images/logo.svg'
import NavButton from '../../components/Buttons/NavButton'

const PageHeader = () => {
    const history = useHistory()

    return (
        <header className={styles.header}>
            <img src={logo} alt="Smart chat logo" onClick={() => history.push('/')}/>
            <nav className={styles.nav}>
                <NavButton handleClick={() => history.push('/about')} title='Product' />
                <NavButton handleClick={() => history.push('/login')} title='Login' />
                <NavButton handleClick={() => history.push('/register')} title='Register' />
                <NavButton handleClick={() => history.push('/try')} title='Try It Free' />
            </nav>
        </header>
    )
}

export default PageHeader