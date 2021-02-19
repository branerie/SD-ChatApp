import styles from './index.module.css'

const StatusLight = ({ size, isOnline }) => {

    return <div className={`${styles.circle} ${styles[isOnline ? 'green' : 'red']} ${styles[size]}`}></div>

}

export default StatusLight
