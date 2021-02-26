import styles from './index.module.css'

const DateSeparator = ({ date }) => {
    let today = new Date().toDateString()
    let yesterday = new Date(new Date() - 86400000).toDateString()

    if (date === today) date = 'TODAY'
    if (date === yesterday) date = 'YESTERDAY'

    return (
        <div className={styles.separator}>
            <div className={styles.side}></div>
            <div className={styles.date}>{date}</div>
            <div className={styles.side}></div>
        </div>
    )
}

export default DateSeparator
