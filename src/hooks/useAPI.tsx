import { useState } from 'react'
import useEventListener from './useEventListener'
import { useLocalStorage } from './useLocalStorage'

const __useAPI__ = '__useAPI__'

export interface DataType {
	"Language": string,
	"Book Type": string,
	"Month": string,
	"Date": string,
	"Year": string ,
	"Topics (Separate with dash)": string,
	"Title in English": string,
	"Title in Original Language": string,
	"File URL": string,
	"uuid": string
}

interface DataJSON { [key: string]: DataType[] }
interface ResponseType {
	data: DataType[],
	filters: string[],
	count: number
}

let data = {} as DataJSON
fetch('/data.json').then( res => res.json()).then( (resData) => data = resData)
setTimeout(() => {
	if (navigator.onLine) {
		fetch('/data.json').then( res => res.json()).then(data => {
			localStorage.setItem(__useAPI__, JSON.stringify(data))
			window.dispatchEvent(new Event(__useAPI__))
		})
	}
	else {
		data = JSON.parse(localStorage.getItem(__useAPI__) || '{}')
		window.dispatchEvent(new Event(__useAPI__))
	}
}, 0)

class API {
	data: DataJSON
	filters: { [key: string]: string[]}
	bookmarks: DataType[]

	constructor(data: DataJSON, bookmarks: DataType[]){
		this.data = data
		this.bookmarks = bookmarks
		this.filters = {}
	}

	get(category: string, params: {search: string, start: number, count:number, filters: string[]}, bookmarkedOnly=false): ResponseType {
		if (!(category in this.data)) return { data: [], filters: [], count: 0 }

		let out: DataType[]
		if (bookmarkedOnly)
			out = this.bookmarks.filter(e => e["Book Type"] === category).map( e => ({...e}))
		else
			out = this.data[category].map(e => ({...e}))

		// console.log(category)

		if (params.search){
			const search = params.search.toLowerCase().trim()
			out = out.filter( e => e["Title in English"].toLowerCase().includes(search) || e['Title in Original Language'].toLowerCase().includes(search))
		}

		if (params.filters.length){
			const filters = new Set(params.filters)
			out = out.filter(e => {
				for (const tag of e["Topics (Separate with dash)"].split('-')){
					if (tag && filters.has(tag))
						return true
				}
				return false
			})
		}

		if (!(category in this.filters)) {
			const newFilters = new Set<string>()
			this.data[category].forEach( elem => elem["Topics (Separate with dash)"].split('-').forEach( tag => tag && newFilters.add(tag)) )
			this.filters[category] = Array.from(newFilters)
		}

		return { data: out.slice(params.start, params.start + params.count), count: out.length, filters: this.filters[category] }
	}
}

export const useAPI = () => {
	const [internalData, setInternalData] = useState(data)
	const {storage: {bookmarks}, setStorage: setBookmarks} = useLocalStorage<{bookmarks: DataType[]}>({
		bookmarks: []
	}, '__useLocalStorage__bookmarks')

	useEventListener(__useAPI__, () => setInternalData(data))
	return {
		API: new API(internalData, bookmarks),
		bookmarks,
		setBookmarks: (newBookmarks: DataType[]) => setBookmarks({ bookmarks: newBookmarks})
	}
}