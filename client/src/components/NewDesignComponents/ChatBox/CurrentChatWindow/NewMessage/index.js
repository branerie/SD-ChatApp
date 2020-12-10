import React from 'react'
import styles from './index.module.css'
import Avatar from 'react-avatar'

const NewMessage = () => {
    return (
        <div className={styles['new-message']}>
            <div className={styles['avatar']} >
                <Avatar size={32} />
            </div>
            <div className={styles['text-box']}>
                <div className={styles['name-time']}>
                    <div className={styles['name']}>
                        Gergan Ruschev
                    </div>
                    <div className={styles['time']}>
                        18:05
                    </div>
                </div>
                <div lassName={styles['message']}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
                </div>
            </div>
        </div>

    )
}

export default NewMessage
