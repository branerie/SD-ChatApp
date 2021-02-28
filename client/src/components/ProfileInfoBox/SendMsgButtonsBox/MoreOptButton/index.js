import styles from './index.module.css'
import moreOptButton from '../../../../icons/more.svg'

const MoreOptButton = () => {
    return (
            <button type='button' className={styles['option-button']}> 
                <img src={moreOptButton} className={styles['image']} alt=''/>
            </button>
    )
}

export default MoreOptButton
