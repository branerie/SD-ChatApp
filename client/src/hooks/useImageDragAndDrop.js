import { useCallback, useEffect } from 'react'

const handleDragEnter = event => event.preventDefault()

const handleDragOver = event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
}

const useImageDragAndDrop = (elementRef, dropCallback) => {
    const handleDrop = useCallback((event) => {
        event.preventDefault()
        let files = [...event.dataTransfer.files]
    
        const uploadedImages = []
        files.forEach(file => {
            if (!file.type.startsWith('image/')) return
    
            console.log(file)
            uploadedImages.push(URL.createObjectURL(file))
        })

        if (uploadedImages.length > 0) {
            dropCallback(uploadedImages)
        }
    }, [dropCallback])

    useEffect(() => {
        if (!elementRef || !elementRef.current) return

        const element = elementRef.current

        element.addEventListener('dragenter', handleDragEnter)
        element.addEventListener('dragover', handleDragOver)
        element.addEventListener('drop', handleDrop)

        return () => {
            element.removeEventListener('dragenter', handleDragEnter)
            element.removeEventListener('dragover', handleDragOver)
            element.removeEventListener('drop', handleDrop)
        }
    }, [elementRef, handleDrop])
}

export default useImageDragAndDrop