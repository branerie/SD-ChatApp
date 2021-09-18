import { useContext } from 'react'
import styles from './index.module.css'
import noLogoPic from '../../../../images/no-logo.png'
import { SocketContext } from '../../../../context/SocketContext'
import { MessagesContext } from '../../../../context/MessagesContext'
import { getFullImageUrl } from '../../../../utils/image'
import MenuButton from '../../../Buttons/MenuButton'

const ProjectLogo = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)

    const showWidget = () => {
        const widget = window.cloudinary.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
            uploadPreset: process.env.REACT_APP_CLOUDINARY_PRESET
        }, (error, result) => {
            if (result.event === 'success') {
                const imagePath = result.info.path
                const { name, description } = userData.sites[userData.activeSite]

                socket.emit('update-project-settings', { sid: userData.activeSite, site: name, description, logo: imagePath }, (error, data) => {
                    dispatchUserData({ type: 'update-project-settings', payload: { data } })
                })
            }

            if (error) {
                //TODO: Handle errors

                return
            }
        })

        widget.open()
    }

    return (
        <div className={styles['pic-container']}>
            <img
                alt='Project Logo'
                src={userData.sites[userData.activeSite].logo
                    ? getFullImageUrl(userData.sites[userData.activeSite].logo)
                    : noLogoPic}
                className={styles['profile-picture']}
            />
            <MenuButton title='Change Logo' onClick={showWidget} btnSize='full' resize={false} />
        </div>
    )
}

export default ProjectLogo
