import styles from './index.module.css'

const Notice = ({ message }) => {

    return (
        <div className={`${styles.notice}`}>
            <div className={`${styles['message']}  ${styles[message.event]}`}>
                {message.msg}
            </div>
        </div>

    )
}

export default Notice
