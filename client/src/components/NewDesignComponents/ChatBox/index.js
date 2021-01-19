import React, {useState, useEffect} from 'react'
import styles from './index.module.css'
import CurrentChatWindow from './CurrentChatWindow/'
import {IsOpenedUseContext} from '../../../context/isOpened'

const ChatBox = () => {

    const context = IsOpenedUseContext()
    let treads = Object.keys(context.openedTreads)
    useEffect(() => {
    }, [context.openedTreads])

    const [isOpened, setIsOpened] = useState(true)
    let [flag, setFlag] = useState(true)

    useEffect(() => {
        return
    }, [])

    return (
        <div className={styles['chat-box']}>
            {   
                treads.map(tread => {
                    if (context.openedTreads[tread]) {
                        return <CurrentChatWindow title={tread} />
                    }
                })
            }
            {/* {
                treads.forEach(tread => {
                    context.openedTreads[tread] ? <CurrentChatWindow title={tread} /> : <div> </div>
                })
            } */}

        </div>
    )
}

export default ChatBox
