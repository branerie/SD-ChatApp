import React, { useContext } from 'react'
import styles from './index.module.css'
import emptyProfilePic from '../../../../images/emptyProfilePic.png'
import { SocketContext } from '../../../../context/SocketContext'
import { MessagesContext } from '../../../../context/MessagesContext'
import { getFullImageUrl } from '../../../../utils/image'
import MenuButton from '../../../Buttons/MenuButton'

const ProfilePicture = () => {
    const { socket } = useContext(SocketContext)
    const { userData, dispatchUserData } = useContext(MessagesContext)

    const showWidget = () => {
        const widget = window.cloudinary.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
            uploadPreset: process.env.REACT_APP_CLOUDINARY_PRESET
        }, (error, result) => {
            if (result.event === 'success') {
                const imagePath = result.info.path

                socket.emit('update-profile-data', { picture: imagePath }, newData => {
                    dispatchUserData({
                        type: 'update-profile-data',
                        payload: {
                            newData
                        }
                    })
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
                alt=''
                src={userData.personal.picture
                    ? getFullImageUrl(userData.personal.picture)
                    : emptyProfilePic}
                className={styles['profile-picture']}
            />
            {/* <button
                type='button'
                className={styles['btn-change']}
                onClick={showWidget}
            >
                Change Picture
            </button> */}
            <MenuButton title='Change Picture' onClick={showWidget} btnSize='full' />
        </div>
    )
}

export default ProfilePicture
