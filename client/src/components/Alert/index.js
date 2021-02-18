import styles from './index.module.css'

const Alert = ({ alerts }) => {

    return (
        <div>
            {alerts.map((alert, index) => {
                return (
                    <div key={index} className={styles.alert}>
                        {alert}
                    </div>
                )
            }
            )}
        </div>
    )
}

export default Alert
