import css from './index.module.css'

const Notice = ({ message }) => {

    // online and offline messages are annoying on many reconnections
    // find another to notify users
    if (message.event === 'online' || message.event === 'offline') return null

    return (
        <div className={`${css.notice} ${css[message.event]}`}>
            {message.msg}
        </div>
    )
}

export default Notice
