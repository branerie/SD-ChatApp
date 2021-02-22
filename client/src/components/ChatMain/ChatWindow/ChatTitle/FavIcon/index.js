import { useState } from 'react'
import css from './index.module.css'
import { ReactComponent as StarEmpty } from '../../../../../images/favouriteStar.svg'
import { ReactComponent as StarFull } from '../../../../../images/facvouriteStarFilled.svg'

const FavIcon = () => {
    const [starred, setStarred] = useState(false)

    function toggleStarred() { //to do subscribe
        setStarred(!starred)
    }

    return (
        <div>
            { starred 
                ? <StarFull className={`${css.star} ${css.full}`} onClick={toggleStarred} /> 
                : <StarEmpty className={`${css.star} ${css.empty}`} onClick={toggleStarred}/>}
        </div>

    )
}

export default FavIcon
