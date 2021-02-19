import styles from './index.module.css'

const SmallButton = ({ title, onClick }) => {
    return (
        <button
            type='button'
            className={styles.btn}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

export default SmallButton
