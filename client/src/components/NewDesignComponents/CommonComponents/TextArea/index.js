import React, {useState, useEffect} from 'react'
import styles from './index.module.css'
import TextareaAutosize from 'react-textarea-autosize'

const TextArea = (props) => {
    const [searchWord, setSearchWord] = useState('')
    const [inputTextSyle, setInputTextSyle] = useState('input')

    useEffect(() => {
        if (searchWord) {
            setInputTextSyle('input-writing')
            console.log(searchWord)
            console.log(inputTextSyle)
        } else {
            setInputTextSyle('input')
            console.log(searchWord)
            console.log(inputTextSyle)
        }
        return
    }, [searchWord])

    return (
        // <textarea
        //     placeholder={props.placeholder}
        //     className={styles[inputTextSyle]}
        //     onFocus={e => {searchWord ? setSearchWord(e.target.value) : e.target.placeholder = props.placeholder} }
        //     onChange={e => setSearchWord(e.target.value)}
        //     value={searchWord}
        //     row='1'
        // />
        <TextareaAutosize 
            className={styles['text-area']}
            placeholder={props.placeholder}
            maxRows={4}
            minRows={1}
        />
    )
}

export default TextArea
