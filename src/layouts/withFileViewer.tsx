import React, { FC, useRef, useState } from "react"
import { Pagination, Button, Tag, Select } from "antd"

import useComponentSize from "@rehooks/component-size"
// import _times from 'lodash.times'
import useSWR from "swr"
import Icon from "@ant-design/icons"

import {useHistory, useLocation} from 'react-router-dom'
import qs from 'query-string'

import { withDefaultLayout, InjectedDefaultLayoutProps, OpenInOptions, PageMeta } from "./withDefaultLayout"

const fetchJSON = (url: string) => {
	return fetch(url).then(res => res.json())
}

// const verifyExists = (url: string) => {
// 	return fetch(`/api/proxy?site=${url}`, {method: 'HEAD'})
// 		.then(res => {
// 			if (res.status === 200) return "primary" as const
// 			else return "danger" as const
// 		})
// 		.catch(err => "ghost" as const)
// }

const handlePDFOpen = (openIn: OpenInOptions, url: string, newTab: boolean = false) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
	console.log('clicked! ' + url + ' ' + openIn)
	if (openIn === 'In Site') {
		if (e.ctrlKey || newTab){
			console.log('open in new ' + url)
			window.open(`http://docs.google.com/gview?embedded=true&url=${url}`, '_blank')
		}
		else{
			console.log('open in same ' + url)
			window.location.href = `http://docs.google.com/gview?embedded=true&url=${url}`
		}
	}
	else if (openIn === 'Browser Default') {
		if (e.ctrlKey || newTab)
			window.open(url, '_blank')
		else
			window.location.href = url
	}
	else if (openIn === 'Installed App')
		window.location.href = `DadaFileViewer://files/${url}`
	else
		console.log(`Could not use option ${openIn} to open ${url}`)
	
    e.preventDefault()
    e.stopPropagation()
}

const NewTabIcon = () => (
	<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 9810 9820" preserveAspectRatio="xMidYMid meet">
		<g id="layer101" fill="#ffffff" stroke="none">
			<path d="M1290 9809 c-716 -7 -769 -11 -889 -70 -91 -45 -275 -229 -320 -320 -70 -143 -65 108 -68 -3414 -3 -2922 -2 -3173 13 -3210 9 -22 24 -58 33 -80 27 -67 104 -177 169 -241 119 -120 232 -177 379 -194 86 -9 1048 -29 1449 -30 l191 0 7 -617 c8 -733 19 -1035 41 -1117 27 -105 72 -173 185 -287 89 -90 118 -112 190 -147 67 -33 104 -44 175 -53 110 -14 4569 -28 5630 -18 775 8 824 11 943 70 79 38 272 227 314 305 15 28 38 96 50 150 l22 99 3 3175 4 3175 -21 50 c-49 114 -87 182 -138 247 -97 120 -225 211 -348 243 -82 22 -370 32 -1110 41 l-621 7 -7 611 c-9 744 -20 1039 -41 1120 -55 207 -240 388 -500 490 -36 14 -300 16 -2565 18 -1389 2 -2815 0 -3170 -3z m5470 -1508 l0 -738 -1976 -5 -1976 -5 -84 -43 c-201 -102 -335 -246 -429 -458 l-35 -80 0 -1956 0 -1956 -740 0 -740 0 0 2990 0 2990 2990 0 2990 0 0 -739z m2280 -4531 l0 -2990 -2990 0 -2990 0 0 2990 0 2990 2990 0 2990 0 0 -2990z"/>
			<path d="M4828 5295 c-83 -21 -135 -51 -194 -110 -58 -60 -86 -112 -109 -204 -19 -73 -10 -153 24 -225 34 -69 341 -387 1385 -1433 550 -552 997 -1005 995 -1008 -3 -2 -248 -7 -544 -10 -605 -7 -796 -16 -869 -41 -76 -26 -185 -139 -217 -224 -33 -89 -33 -209 1 -295 33 -84 132 -183 215 -214 102 -38 283 -43 1440 -39 l1070 3 50 25 c64 32 193 161 225 225 l25 50 3 1106 c2 614 -1 1162 -6 1232 -12 152 -35 211 -115 291 -145 145 -340 167 -501 57 -88 -61 -147 -145 -166 -238 -6 -26 -15 -338 -20 -692 -6 -355 -13 -647 -15 -650 -6 -5 -56 44 -1285 1264 -687 683 -958 946 -1093 1062 -79 68 -194 94 -299 68z"/>
		</g>
		<g id="layer102" fill="#f8f8f8" stroke="none">
			<path d="M3 7800 c0 -36 2 -50 4 -32 2 17 2 47 0 65 -2 17 -4 3 -4 -33z"/>
			<path d="M5530 4825 c19 -19 36 -35 39 -35 3 0 -10 16 -29 35 -19 19 -36 35 -39 35 -3 0 10 -16 29 -35z"/>
			<path d="M5035 4240 c27 -27 51 -50 54 -50 3 0 -17 23 -44 50 -27 28 -51 50 -54 50 -3 0 17 -22 44 -50z"/>
			<path d="M6590 3775 c206 -206 377 -375 380 -375 3 0 -164 169 -370 375 -206 206 -377 375 -380 375 -3 0 164 -169 370 -375z"/>
			<path d="M6430 2835 c300 -300 547 -545 550 -545 3 0 -240 245 -540 545 -300 300 -547 545 -550 545 -3 0 240 -245 540 -545z"/>
			<path d="M8303 1850 c0 -25 2 -35 4 -22 2 12 2 32 0 45 -2 12 -4 2 -4 -23z"/>
		</g>
	</svg>
)

const FileViewer: FC<InjectedDefaultLayoutProps> = ({ developerMode, query, openIn, language, apiBaseURL, filterByDate, filterByTopics }) => {
    const location = useLocation()
    const history = useHistory()

    // DATA DISPLAY
	// -- PAGINATION
	const ref = useRef(null)
	const size = useComponentSize(ref)
	const {height: listHeight} = size
	const ITEMS_PER_PAGE = Math.floor(listHeight / ROW_HEIGHT) || 1
	// const ITEMS_PER_PAGE = 30
    // -- FILTERS
	const [currentFilters, setCurrentFilters] = useState<string[]>(query.filters || [])

	const setPageWithFilters = (newFilters: string[]) => {
		const newQuery = {...query, filters: newFilters}
		if ('page' in newQuery)
			delete newQuery.page

		history.replace({pathname: location.pathname, search: qs.stringify(newQuery, {arrayFormat:'separator', arrayFormatSeparator:'-'})})
		setCurrentFilters(newFilters)
	}

	// -- DATA FETCHING
	const [currentPage, setCurrentPage] = useState(parseInt(query.page || '1'))

    const setPageWithURL = (pageNum: number) => {
        const newQuery = {...query}
        if (pageNum > 1)
            newQuery.page = pageNum.toString()
        else if ('page' in newQuery)
            delete newQuery.page
    
		history.replace({pathname: location.pathname, search: qs.stringify(newQuery, { arrayFormat:'separator', arrayFormatSeparator:'-'})})
		setCurrentPage(pageNum)
    }
	const handlePageChange = (current: number) => setPageWithURL(current)

	// -- LOADING INDICATORS
	const {data: response} = useSWR<{data: DataTypeV2[], count: number, filters: string[]}>(`${apiBaseURL}?start=${(currentPage - 1) * ITEMS_PER_PAGE}&count=${ITEMS_PER_PAGE}&search=${query.search || ''}${currentFilters.map( v => `&filters=${v}`).join('')}`, fetchJSON)

	// -- BOOKMARKS
	// // const {storage: {bookmarks: bookmarksArray}, setStorage: setBookmarks} = useLocalStorage<{bookmarks: string[]}>({
	// //   bookmarks: []
	// // }, '__useLocalStorage__bookmarks')
	// // const bookmarks = new Set(bookmarksArray)

    return (
		<>
		{
			filterByTopics && (
				<Select
					mode="multiple"
					style={{ width: '100%', paddingTop: 12, paddingBottom: 20, paddingLeft: 12, paddingRight: 20 }}
					placeholder="Filter by topic"
					value={currentFilters}
					onChange={ setPageWithFilters }
				>
					{
						response && response.filters.map( v => <Select.Option key={v} value={v}> {v} </Select.Option>)
					}
				</Select>
			)
		}
		<div style={{ flexGrow: 1, flexShrink: 1, overflow: 'auto' }} ref={ref}>
		{
			// response && response.data.map( (rowData, index) => <RenderRow key={rowData.uuid} {...{rowData, language, openIn, rowHeight: ROW_HEIGHT, showTopics: filterByTopics, setBookmarks, isBookmarked: bookmarks.has(rowData['Title in English'])}}/> )
			response && response.data.map(
				(row, index) => (
					<a key={row.uuid} href={row['File URL']} onClick={ e => e.preventDefault() }>
						<div
							style={{ height: ROW_HEIGHT, width: '100%', paddingLeft: 12, paddingRight: 12 }}
							onClick={ handlePDFOpen(openIn, row['File URL'])}
						>
							<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }} >
								<span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
									<h3 style={{ fontSize: 16, display: 'inline'}}> {language === 'english' ? row['Title in English'] : row['Title in Original Language']} </h3>
								</span>
								<Button style={{ flexGrow: 0, flexShrink: 0 }} shape="circle-outline" type="link" onClick={ handlePDFOpen(openIn, row['File URL'], true)}> <Icon component={NewTabIcon} style={{ height: 16, width: 16}}/> </Button>
							</div>
							<div style={{ float: 'right'}}>
								{
									row["Topics (Separate with dash)"].length > 0 &&
									row["Topics (Separate with dash)"].split('-').map( (val, index) =>
										<Tag
											color={assignColor(val)}
											key={val}
										>
											{ val }
										</Tag>
									)
								}
							</div>
						</div>
					</a>
				)
			)
		}
		</div>
		<Pagination style={{ alignSelf: 'center' }} disabled={!response} current={currentPage} simple pageSize={ITEMS_PER_PAGE} total={ response ? response.count : 1} onChange={handlePageChange}/>
		</>
	)
}


export default (pageMeta: PageMeta) => withDefaultLayout(FileViewer, pageMeta)

interface DataType {
	"book_type": string,
	"folder_name": string,
	"year": string | null,
	"month": string | null,
	"date": string | null,
	"topic": string | null,
	"title_original": string ,
	"title_english": string,
	"title_by_date": string | null,
	"filename": string,
	"language": string,
	"uuid": string
}

interface DataTypeV2 {
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

const ROW_HEIGHT = 72

const __TOPIC_COLORS = ['lime', 'gold', 'green', 'magenta','cyan', 'blue','orange', 'geekblue','volcano', 'purple', 'red']
const __TOPIC_COLOR_MAPPING = {} as {[key: string]: string}
let __ASSIGNED = 0

const assignColor = (val: string) => {
	if (!(val in __TOPIC_COLOR_MAPPING)){
		__TOPIC_COLOR_MAPPING[val] = __TOPIC_COLORS[__ASSIGNED % __TOPIC_COLORS.length]
		__ASSIGNED++
	}

	return __TOPIC_COLOR_MAPPING[val]
}