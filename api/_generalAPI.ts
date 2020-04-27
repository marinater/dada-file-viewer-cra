// AUTO-GENERATED BY yarn generate
//@ts-ignore
import { NextApiRequest, NextApiResponse } from 'next'
import data from '../data/general2.json'

interface PageMeta {
    "Language": string,
    "Month": string,
    "Date": string,
    "Year": string,
    "Topics (Separate with dash)": string,
    "Title in English": string,
    "Title in Original Language": string,
    "File URL": string,
    "uuid": string
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

export const GeneralAPI = (book_type: string) => {
    //@ts-ignore
    const pads = data[book_type] as PageMeta[]
    const allFilters = new Set()

    for (const pad of pads){
        pad['uuid'] = uuidv4()
        pad['Topics (Separate with dash)'].split('-').forEach(
            e => {
                if (e.trim()) allFilters.add(e)
            }
        )
    }

	return (req: NextApiRequest, res: NextApiResponse) => {
    	const start = Math.max(parseInt((req.query.start || '').toString()) || 0, 0)
		const count = Math.max(parseInt((req.query.count || '').toString()) || 0, 0)
        const search = (req.query.search || '').toString().toLowerCase()

        const filters = typeof req.query.filters === 'object' ? req.query.filters : req.query.filters ? [req.query.filters] : []
        const filtersSet = new Set(filters)

		let arr = pads
        if (filters.length > 0){
            arr = arr.filter(
                e => {
                    for (const topic of e['Topics (Separate with dash)'].split('-')){
                        if (filtersSet.has(topic))
                            return true
                    }
                    return false
                }
            )
        }

		if (search){
			arr = arr.filter(
				e => (
					e['Title in English'].toLowerCase().includes(search) ||
					e['Title in Original Language'].toLowerCase().includes(search)
				)
			)
		}
		const totalItems = arr.length
		arr = arr.slice(start, start + count)

		res.statusCode = 200
		res.setHeader('Content-Type', 'application/json')
		res.end(JSON.stringify({data: arr, count: totalItems, filters: Array.from(allFilters)}))
	}
}