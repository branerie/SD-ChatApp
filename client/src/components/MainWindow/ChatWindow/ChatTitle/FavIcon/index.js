import { useState } from 'react'
import styles from './index.module.css'
import favouriteStar from '../../../../../images/favouriteStar.svg'
import favouriteStarFilled from '../../../../../images/facvouriteStarFilled.svg'


const FavIcon = () => {
    const [favStarSrc, setFavStarSrc] = useState(favouriteStar)
    const [favStarState, setFavStarState] = useState(false)

    return (
        <img
            alt=''
            src={favStarSrc}
            className={styles['fav-star']}
            onClick={() => {
                if (favStarState) {
                    setFavStarSrc(favouriteStar)
                } else {
                    setFavStarSrc(favouriteStarFilled)
                }
                setFavStarState(!favStarState)
            }}
        />
    )
}

export default FavIcon
