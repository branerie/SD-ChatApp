import css from './index.module.css'
// import sendFile from '../../../icons/attach.svg'
// import voiceMsg from '../../../icons/record.svg'
import TextArea from '../../Common/TextArea'


const SendMessageBox = () => {
    return (
        <div className={css.container}>
            {/* <div className={css.file}>
                <img src={sendFile} alt=''/>
            </div>
            <div className={css.voice}>
                <img src={voiceMsg} alt=''/>
            </div> */}
            <div className={css.text}>
                <TextArea />
            </div>
        </div>
    )
}

export default SendMessageBox
