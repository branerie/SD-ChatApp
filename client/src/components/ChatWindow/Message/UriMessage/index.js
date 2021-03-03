import css from './index.module.css'

const UriMessage = ({ msg }) => {
    return (
        <a href={msg}
            rel='noopener noreferrer'
            target='_blank'
        >{msg}</a>
    )
}

export default UriMessage
