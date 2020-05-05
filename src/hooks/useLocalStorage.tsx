import { useState, useCallback, useEffect } from "react"
import useEventListener from './useEventListener'

export type StorageType<T> = {
	[key in keyof T]: string | number | boolean | string[] | number[] | boolean[]
}

export const useLocalStorage = <T extends StorageType<T>>(defaultValues: T, sessionID: string = '__useLocalStorage__', override: boolean = false) => {
	const [hookStorage, setHookStorage] = useState({...defaultValues})

    const syncWithLocalStorage = useCallback((additional?: Partial<T>) => {
        const initStorage = {...defaultValues}
        const currentStorage = JSON.parse(localStorage.getItem(sessionID) || '{}') as T

        for (let [key, defaultValue] of Object.entries(defaultValues)){
            if (key in currentStorage && !override)
                // @ts-ignore
                initStorage[key] = currentStorage[key]
            else
                //@ts-ignore
                currentStorage[key] = defaultValue        
        }
        
        Object.assign(initStorage, additional)
        Object.assign(currentStorage, additional)

        localStorage.setItem(sessionID, JSON.stringify(currentStorage))
        setHookStorage(initStorage)
    },[defaultValues, override, sessionID])

    useEventListener('storage', () => syncWithLocalStorage())

	useEffect(() => {
        syncWithLocalStorage()
        // eslint-disable-next-line
    }, []) 

	return {storage: hookStorage, setStorage: syncWithLocalStorage}
}

export default useLocalStorage