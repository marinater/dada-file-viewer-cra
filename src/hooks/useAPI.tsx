import { useEffect, useState } from 'react'
import useEventListener from './useEventListener'

const __useAPI__ = '__useAPI__'

interface DataType {
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
	constructor(data: DataJSON){
		this.data = data
	}

	get(category: string, params: {search: string, start: number, count:number, filters: string[]}): ResponseType {
		if (!(category in this.data)) return { data: [], filters: [], count: 0 }

		let out = this.data[category].map(e => ({...e}))
		
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

		return { data: out.slice(params.start, params.start + params.count), count: out.length, filters: [] }
	}
}

export const useAPI = () => {
	const [internalData, setInternalData] = useState(data)
	useEventListener(__useAPI__, () => setInternalData(data))
	return new API(internalData)
}