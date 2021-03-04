import { useCallback, useEffect } from 'react'

const handleDragEnter = event => event.preventDefault()

const handleDragOver = event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
}

const useImageDragAndDrop = (elementRef, dropCallback) => {
    const handleDrop = useCallback((event) => {
        event.preventDefault()
        if (!event.dataTransfer || !event.dataTransfer.files) return

        const imgFiles = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))

        if (imgFiles.length > 0) dropCallback(imgFiles)
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