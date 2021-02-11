const getFullImageUrl = (imagePath) => {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/${imagePath}`
}

const getFaceCroppedImageUrl = (imagePath) => {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/w_500,h_500,c_crop,f_png,g_face,r_max/w_200/${imagePath}`
}

export {
    getFullImageUrl,
    getFaceCroppedImageUrl
}