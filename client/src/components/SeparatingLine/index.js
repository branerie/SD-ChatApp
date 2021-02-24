import React from 'react'
import styles from './index.module.css'

const SeparatingLine = ({ horizontal }) => {
    return (
        <div className={horizontal ? styles.horizontal : styles.vertical}></div>
    )
}

export default SeparatingLine