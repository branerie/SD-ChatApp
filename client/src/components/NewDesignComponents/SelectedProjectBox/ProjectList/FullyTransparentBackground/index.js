import React from 'react'
import styles from './index.module.css'

const FullyTransparentBackground = (props) => {
    return (
        <div className={styles['window']} onClick={props.closeOpenedWindows} />
    )
}

export default FullyTransparentBackground