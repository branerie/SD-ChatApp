import styles from './index.module.css'

const Notice = ({ message }) => {

    return (
        <div className={`${styles.notice} ${styles[message.event]}`}>
            {message.msg}
        </div>
    )
}

export default Notice
