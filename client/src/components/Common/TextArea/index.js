import styles from './index.module.css'
import Picker from 'emoji-picker-react'
import TextareaAutosize from 'react-textarea-autosize'
import useDetectOutsideClick from '../../../hooks/useDetectOutsideClick'
import { replaceEmojis } from '../../../utils/text'

import emotIcon from '../../../icons/emoticon.svg'

const TextArea = ({ msg, setMsg, sendMessage }) => {
    const { ref, isVisible, setIsVisible } = useDetectOutsideClick()
    
    function getKey(e) {
        if (e.key !== 'Enter') return
        e.preventDefault()
        sendMessage()
    }

    return (
        <>
            <TextareaAutosize
                className={styles['text-area']}
                placeholder='Message...'
                value={msg}
                onChange={e => setMsg(replaceEmojis(e.target.value))}
                onKeyPress={e => getKey(e)}
                autoFocus
                maxRows={3}
            />
            <div onClick={() => setIsVisible(!isVisible)} className={styles['link-emoji']}>
                <img src={emotIcon} alt=''/>
            </div>
            { isVisible &&
                <div className={styles.emoji} ref={ref}>
                    <Picker onEmojiClick={(e, emojiObj) => setMsg(msg + emojiObj.emoji)} />
                </div>
            }
        </>
    )
}

export default TextArea
