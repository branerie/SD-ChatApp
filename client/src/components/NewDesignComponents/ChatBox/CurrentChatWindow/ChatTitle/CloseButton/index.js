import React, {useState}from 'react'
import styles from './index.module.css'
import closeButton from '../../../../../../images/closeButton.svg'
import closeButtonHover from '../../../../../../images/closeButtonHover.svg'
import {IsOpenedUseContext} from '../../../../../../context/isOpened'

const CloseButton = (props) => {
    const [closeButtonSrc, setCloseButtonSrc] = useState(closeButton)
    const context = IsOpenedUseContext()
  
    return (
        <img
            className={styles['close-button']}
            src={closeButtonSrc}
            onMouseEnter={() => { setCloseButtonSrc(closeButtonHover) }}
            onMouseOut={() => { setCloseButtonSrc(closeButton) }}
            onClick={() => {
                context.changeOpenState([props.title], false)
            }}
            alt=''
        />
    )
}

export default CloseButton
