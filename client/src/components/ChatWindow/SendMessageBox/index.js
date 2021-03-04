import css from './index.module.css'
import TextArea from '../../Common/TextArea'
// import sendFile from '../../../icons/attach.svg'
// import voiceMsg from '../../../icons/record.svg'


const SendMessageBox = () => {
    return (
        <div className={css.container}>
            {/* <div className={css.file}>
                <img src={sendFile} alt=''/>
            </div> */}
            {/* <div className={css.voice}>
                <img src={voiceMsg} alt=''/>
            </div> */}
            <div className={css.text}>
                <TextArea />
            </div>
        </div>
    )
}

export default SendMessageBox
