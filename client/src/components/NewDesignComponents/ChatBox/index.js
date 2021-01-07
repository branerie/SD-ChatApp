import React from 'react'
import styles from './index.module.css'
import CurrentChatWindow from './CurrentChatWindow/'

const ChatBox = () => {
<<<<<<< Updated upstream
=======
    const context = IsOpenedUseContext()
    let treads = Object.keys(context.openedTreads)

    
    useEffect(() => {
    
    }, [context.openedTreads])



>>>>>>> Stashed changes
    return (
        <div className={styles['chat-box']}>
<<<<<<< Updated upstream
            <CurrentChatWindow />
            <CurrentChatWindow />  
=======
            {   
                treads.map(tread => {
                    if (context.openedTreads[tread]) {
                        return <CurrentChatWindow title={tread} />
                    }
                })
            }

>>>>>>> Stashed changes
        </div>
    )
}

export default ChatBox
