import React from 'react'
import styles from './index.module.css'
import moreOptButton from '../../../../../images/moreOptButton.svg'

const MoreOptButton = () => {
    return (
            <button type='button' className={styles['option-button']}> 
                <img src={moreOptButton} className={styles['image']}/>
            </button>
    )
}

export default MoreOptButton
