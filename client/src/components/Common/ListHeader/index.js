import css from './index.module.css'

const ListHeader = ({title}) => {
    return <div className={css.header}>{title}</div>
}

export default ListHeader
