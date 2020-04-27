import { useEffect } from 'react'

export const useStylesheet = (dark: boolean) => {
	useEffect( () => {
		const head = document.head
		const link = document.createElement('link')
		link.type = 'text/css'
		link.rel= 'stylesheet'
		link.href = dark ? '/dark.css' : '/light.css'
		head.appendChild(link)

		return () => { head.removeChild(link) }
	}, [dark])
}