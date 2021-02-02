import React from 'react'
import styles from './index.module.css'

const DevLine = ({ date }) => {
    let today = new Date().toDateString()
    let yesterday = new Date(new Date() - 86400000).toDateString()

    if (date === today) date = 'TODAY'
    if (date === yesterday) date = 'YESTERDAY'

    return (
        <div className={styles['dev-line-box']}>
            <div className={styles['left-side-box']}>
                <div className={styles['left1']}>

                </div>
                <div className={styles['left2']}>

                </div>
            </div>
            <div className={styles['text']}>
                {date}
            </div>
            <div className={styles['right-side-box']}>
                < div className={styles['right1']}>

                </div>
                <div className={styles['right2']}>

                </div>
            </div>

        </div>
    )
}

export default DevLine
