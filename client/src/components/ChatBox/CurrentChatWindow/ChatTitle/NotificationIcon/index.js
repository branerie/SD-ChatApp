import { useState } from 'react'
import styles from './index.module.css'
import notificationIcon from '../../../../../images/notificationIcon.svg'
import notificationIconFilled from '../../../../../images/notificationIconFilled.svg'


const CloseButton = (props) => {
    const [notIconSrc, setNotIconSrc] = useState(notificationIcon)
    const [notIconState, setNotIconState] = useState(false)

    return (
        <img
            alt=''
            src={notIconSrc}
            className={styles['notification-icon']}
            onClick={() => {
                if (notIconState) {
                    setNotIconSrc(notificationIcon)
                } else {
                    setNotIconSrc(notificationIconFilled)
                }
                setNotIconState(!notIconState)
            }}
        />
    )
}

export default CloseButton
