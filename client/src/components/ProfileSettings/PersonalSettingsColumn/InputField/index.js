import styles from './index.module.css'

const InputField = ({ value, input, updateData, isChanged }) => {

    return (
        <div className={styles['input-field']}>
            <label className={styles['label']}>{input}
                <div className={`${styles['input-container']} ${isChanged && styles['input-changed']}`}>
                    <input
                        className={styles['input']}
                        value={value}
                        onChange={e => updateData(input, e.target.value)}
                    />
                </div>
            </label>
        </div>
    )
}

export default InputField
