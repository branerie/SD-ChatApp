import React from 'react'
import styles from './index.module.css'

const TransparentBackground = (props) => {
    return (
        <div className={styles['window']} onClick={()=>props.setBackgroundShown(false)} />
    )
}

export default TransparentBackground