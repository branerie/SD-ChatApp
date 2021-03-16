const getFullImageUrl = (imagePath) => {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/${imagePath}`
}

const getFaceCroppedImageUrl = (imagePath) => {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/w_1200,h_1200,c_crop,f_png,g_face,r_max/w_200/${imagePath}`
}

const getRoundedImageUrl = (imagePath) => {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/f_png,r_max/w_200/${imagePath}`
}

const uploadImage = async (imageFile) => {
    //TODO: switch to signed uploads
    try {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET)

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        })

        const result = await response.json()
        return result.url
    } catch (error) {
        //TODO: Handle uploading error
        return { error: `Failed to upload image ${imageFile}` }
    }
}

export {
    getFullImageUrl,
    getFaceCroppedImageUrl,
    getRoundedImageUrl,
    uploadImage
}