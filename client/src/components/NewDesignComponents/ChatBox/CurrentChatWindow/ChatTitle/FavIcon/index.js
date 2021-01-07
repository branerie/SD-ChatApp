import React, {useState, useEffect}from 'react'
import styles from './index.module.css'
import favouriteStar from '../../../../../../images/favouriteStar.svg'
import favouriteStarFilled from '../../../../../../images/facvouriteStarFilled.svg'


const FavIcon = (props) => {
  
    const [favStarSrc, setFavStarSrc] = useState(favouriteStar)

    const [favStarState, setFavStarState] = useState(false)

    return (
                <img 
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
