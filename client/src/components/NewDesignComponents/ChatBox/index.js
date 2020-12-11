import React, {useState, useEffect} from 'react'
import styles from './index.module.css'
import CurrentChatWindow from './CurrentChatWindow/'
import {IsOpenedUseContext} from '../../../context/isOpened'

const ChatBox = () => {
    const [isOpened, setIsOpened] = useState(true)
    let [flag, setFlag] = useState(true)
    const context = IsOpenedUseContext()
    let treads = Object.keys(context.openedTreads)

    useEffect(() => {
        return
    }, [])



    return (
        
        <div className={styles['chat-box']}>
            {
                treads.forEach(tread => {
                    // if(context.openedTreads[tread]){
                    //     console.log(context.openedTreads);
                    //     flag= !flag
                    //     return <CurrentChatWindow title={tread} />
                    // }

                    context.openedTreads[tread] ? <CurrentChatWindow title={tread} /> : <div> </div>

                    // return <CurrentChatWindow title={'tread'} />
                })
            }
           
        </div>
    )
}

export default ChatBox
