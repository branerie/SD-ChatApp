import css from './index.module.css'

const ListItems = ({children}) => {
    return (
        <div className={css.container}>
            {children}
        </div>
    )
}

export default ListItems
