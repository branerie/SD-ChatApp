import styles from './index.module.css'

const GroupCard = ({ name, selected, onClick }) => {
    return (
        <div className={`${styles.card} ${selected ? styles.selected : null}`} onClick={onClick}>
            <div className={styles.name}>
                <span>{name}</span>
            </div>
        </div>
    )
}

export default GroupCard