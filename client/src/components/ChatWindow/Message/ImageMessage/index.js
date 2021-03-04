import css from './index.module.css'

const ImageMessage = ({ msg }) => {
    return (
        <div className={css.container}>
            <img src={msg} onClick={() => window.open(msg, '_blank')} />
        </div>
    )
}

export default ImageMessage
