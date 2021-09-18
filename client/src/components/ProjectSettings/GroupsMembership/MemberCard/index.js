import styles from './index.module.css'

import UserAvatar from "../../../Common/UserAvatar"
import { ReactComponent as UserAdd } from '../../../../icons/user-add.svg'
import { ReactComponent as UserDel } from '../../../../icons/user-del.svg'

const icon = {
    add: <UserAdd className={styles.plus} />,
    del: <UserDel className={styles.minus} />
}

const MemberCard = ({ type, onClick, name, picturePath }) => {
    return (
        <div className={styles.card}>
            <div className={styles.member}>
                <UserAvatar picturePath={picturePath} />
                <span>{name}</span>
            </div>
            <div className={styles.icon} onClick={onClick}>
                {icon[type]}
            </div>
        </div>
    )
}

export default MemberCard
