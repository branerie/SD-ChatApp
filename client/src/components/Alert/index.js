import React from 'react'
import styles from './index.module.css'

const Alert = (props) => {
    return (
        <div>
            {props.alert ? (
                <div className={styles.alert}>
                    {props.alert}
                </div>
            ) : null}
        </div>
    )
}

export default Alert
