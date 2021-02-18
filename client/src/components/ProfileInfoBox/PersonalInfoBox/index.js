import React from 'react'
import styles from './index.module.css'
import Info from './Info'


const PersonalInfoBox = ({ username, email, company }) => {
    return (
        <div>
            <div className={styles['personal-info-box']}>
                <Info title='Username' text={username} />
            </div>
            { email &&
                <div className={styles['personal-info-box']}>
                    <Info title='Email' text={email} />
                </div>
            }
            { company &&
                <div className={styles['personal-info-box']}>
                    <Info title='Company' text={company} />
                </div>
            }
        </div>
    )
}

export default PersonalInfoBox
