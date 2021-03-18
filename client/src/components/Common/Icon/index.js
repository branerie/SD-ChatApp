import css from './index.module.css'
import { ReactComponent as Gear } from '../../../icons/gear.svg'
import { ReactComponent as Info } from '../../../icons/info.svg'
import { ReactComponent as Bell } from '../../../icons/bell-full.svg'
import { ReactComponent as Msg } from '../../../icons/comment.svg'
import { ReactComponent as Members } from '../../../icons/chat-group.svg'

const icons = {
    gear: <Gear />,
    info: <Info />,
    bell: <Bell className={css.notification}/>,
    msg: <Msg className={css.notification}/>,
    members: <Members />
}

const Icon = ({icon, count = 0, onClick}) => {
    return (
        <div className={css.container} onClick={onClick}>
            {count > 0 && <div className={css.counter}>{count > 9 ? '9+': count}</div>}
            {icons[icon]}
        </div>
    )
}

export default Icon
