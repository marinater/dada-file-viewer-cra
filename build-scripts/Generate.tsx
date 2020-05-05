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
    selectableRoutes: { url: string, title: string }[],
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
            selectableRoutes,
		}

		out.push(parsedMeta)
	}

	fs.writeFileSync(jsonFilePath, JSON.stringify(out, null, 4))
}