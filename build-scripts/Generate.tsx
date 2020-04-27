import {DataType, MetaType} from './ParseCSVs'
import path, { parse } from 'path'
import fs from 'fs'

const toSafeName= (str: string) => str.toLowerCase().replace(/ /g, '-')
const metaKeys = {
	'Page Title': 'title',
	'Page Sub Title': 'subTitle',
	'Previous Page URL': 'prevPagePath',
	'Filter By Topics': 'filterByTopics',
	'Filter by Date': 'filterByDate'
}

interface PageMeta {
	title: string,
	subtitle: string,
	apiBaseURL: string,
	prevPagePath: string,
	filterByTopics: boolean,
	filterByDate: boolean,
	selectableRoutes: { url: string, title: string }[]
}

export const GenerateJSON = async(data: DataType[], jsonFilePath: string) => {
	const selectableRoutes = data.map( e => ({url: '/viewer/' + toSafeName(e.pageMeta["Page Title"]), title: e.pageMeta['Page Title']}))
	const out: PageMeta[] = []
	for (const {pageMeta} of data){
		const parsedMeta: PageMeta = {
			title: pageMeta["Page Title"],
			subtitle: pageMeta['Page Sub Title'],
			apiBaseURL: `/api/${toSafeName(pageMeta['Page Title'])}`,
			prevPagePath: '/',
			filterByTopics: pageMeta['Filter By Topics'].toLowerCase() === 'true',
			filterByDate: pageMeta['Filter by Date'].toLowerCase() === 'true',
			selectableRoutes
		}

		out.push(parsedMeta)
	}

	fs.writeFileSync(jsonFilePath, JSON.stringify(out, null, 4))
}

export const GenerateAPI = async(data: DataType[], apiDirectoryPath: string) => {
	try {
		await fs.rmdirSync(apiDirectoryPath)
    }
    catch (e) {
        // console.log(e)
    }
	finally {
		await fs.mkdirSync(apiDirectoryPath)
	}
	for (const {pageMeta} of data){
		const filepath = path.resolve(apiDirectoryPath, toSafeName(pageMeta['Page Title']) + '.tsx')
		await fs.writeFileSync(filepath, apiTemplate(pageMeta['Page Title']))
    }
    
    await fs.writeFileSync(path.resolve(apiDirectoryPath, '_generalAPI.tsx'), GeneralAPI)
}



const apiTemplate = (name: string) => `// AUTO-GENERATED BY yarn generate
import {GeneralAPI} from './_generalAPI'
export default GeneralAPI('${name}')`

const GeneralAPI = `// AUTO-GENERATED BY yarn generate
//@ts-ignore
import { NextApiRequest, NextApiResponse } from 'next'
import data from '../data/general2.json'

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

export const GeneralAPI = (book_type: string) => {
    const pads = data[book_type]
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
`