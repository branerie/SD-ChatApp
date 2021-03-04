import { useContext, useState } from 'react'
import styles from './index.module.css'
import Picker from 'emoji-picker-react'
import TextareaAutosize from 'react-textarea-autosize'
import useDetectOutsideClick from '../../../hooks/useDetectOutsideClick'
import { replaceEmojis } from '../../../utils/text'

import { MessagesContext } from '../../../context/MessagesContext'
import { uploadImage } from '../../../utils/image'

import { ReactComponent as FileImage } from '../../../icons/file-image.svg'
import { ReactComponent as EmojiIcon } from '../../../icons/emoticon.svg'
import { ReactComponent as SendButton } from '../../../icons/send.svg'

const TextArea = () => {
    const [msg, setMsg] = useState('')
    const { sendMessage } = useContext(MessagesContext)
    const { ref, isVisible, setIsVisible } = useDetectOutsideClick()

    const handleMsgSend = () => {
        sendMessage(msg)
        setMsg('')
    }
    
    const getKey = e => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        handleMsgSend()
    }

    const handleImageUpload = async (event) => {
        event.preventDefault()

        const { files } = event.target
        if (!files || !files[0]) return

        for (let file of files) {
            const imgLink = await uploadImage(file)
            if (imgLink.error) {
                //TODO: Handle image upload error
                return
            }

            sendMessage(imgLink, 'image')
        }
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
            <label className={styles.image}>
                <FileImage className={styles['img-icon']} />
                <input name='imgUpload' type='file' onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <EmojiIcon className={styles['link-emoji']} onClick={() => setIsVisible(!isVisible)} />
            <SendButton className={styles.send} onClick={handleMsgSend} />
            { isVisible &&
                <div className={styles.emoji} ref={ref}>
                    <Picker onEmojiClick={(e, emojiObj) => setMsg(msg + emojiObj.emoji)} />
                </div>
            }
        </>
    )
}

export default TextArea
