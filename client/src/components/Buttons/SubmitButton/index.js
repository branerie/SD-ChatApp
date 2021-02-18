import styles from './index.module.css'

const SubmitButton = ({ title }) => { 
    return <button type='submit' className={styles.btn}>{title}</button>
}

export default SubmitButton