import React from 'react'
import styles from './index.module.css'

const InfoTitle = (props) => {
    return (
        <div>
            <div className={styles['info-title']}>
                {props.title}
            </div>
            <div className={styles['info-text']}>
                {props.text}
            </div>
        </div>

    )
}

export default InfoTitle
