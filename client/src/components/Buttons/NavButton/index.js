import styles from './index.module.css'

const NavButton = ({handleClick, title}) => {
    return (
        <button onClick={handleClick} className={styles.btn}>{title}</button>
    )
}

export default NavButton
