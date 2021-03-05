import css from './index.module.css'

const ImageMessage = ({ msg, scrollDown }) => {

    return (
        <div className={css.container} onLoad={scrollDown}>
            <img src={msg} onClick={() => window.open(msg, '_blank')} alt='' />
        </div>
    )
}

export default ImageMessage
