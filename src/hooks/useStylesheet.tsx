import { useEffect } from 'react'

export const useStylesheet = (dark: boolean) => {
	useEffect(() => {
        const newID = `__useStyleSheet${dark ? 'Dark' : 'Light'}__`
        const oldID = `__useStyleSheet${!dark ? 'Dark' : 'Light'}__`

        const newStyleSheetLink = document.getElementById(newID)
        const oldStyleSheetLink = document.getElementById(oldID)

        if (oldStyleSheetLink)
            document.head.removeChild(oldStyleSheetLink)

        if (!newStyleSheetLink){
            const link = document.createElement('link')
            link.type = 'text/css'
            link.rel= 'stylesheet'
            link.href = dark ? '/dark.css' : '/light.css'
            link.className = newID
            document.head.appendChild(link)

            return () => { document.head.removeChild(link) }
        }
	}, [dark])
}