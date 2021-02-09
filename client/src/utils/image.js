const getFullImageUrl = (imagePath) => {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload/${imagePath}`
    
}

export {
    getFullImageUrl
}