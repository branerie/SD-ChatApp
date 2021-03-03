import { useState, useRef, useEffect } from 'react'

function useDetectOutsideClick(initialIsVisible = false) {
	const [isVisible, setIsVisible] = useState(initialIsVisible)
	const ref = useRef(null)

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsVisible(false)
			}
		}

		if (isVisible) {
			document.addEventListener('click', handleClickOutside)
			
			return () => {
				document.removeEventListener('click', handleClickOutside)
			}
		}
	}, [isVisible])

	return { ref, isVisible, setIsVisible }
}

export default useDetectOutsideClick