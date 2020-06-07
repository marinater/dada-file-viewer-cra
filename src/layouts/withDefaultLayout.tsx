import React, { FC, useCallback, useState, useMemo } from "react"
import './withDefaultLayout.css'

import { Switch, Input, Button, Divider, PageHeader, Select, Tooltip, Drawer, List} from "antd"
import { QuestionCircleTwoTone, SettingOutlined } from "@ant-design/icons"
import useLocalStorage from "hooks/useLocalStorage"
import Media from "react-media"

import {useLocation, useHistory} from 'react-router-dom'
import qs from 'query-string'

const MoreInfo: FC<{info: string}> = ({ info }) => (
<Tooltip title={ () => info.split('.').map( (t,i) => <div key={i}>{t}</div>)  }>
		<span style={{fontSize: 18, padding: 5}}>
			<QuestionCircleTwoTone/>
		</span>
	</Tooltip>
)

export const withDefaultLayout = (PageContent: FC<InjectedDefaultLayoutProps>, pageMeta: PageMeta): FC<{darkMode: boolean, setDarkMode: (to: boolean) => void }> => ({ darkMode, setDarkMode}) => {
	const location = useLocation()
    const history = useHistory()
    const query = qs.parse(location.search, {arrayFormat: 'separator', arrayFormatSeparator: '-'}) as DefaultParams
    if (typeof query.filters === 'string')
        query.filters = [query.filters]
    else if (!Array.isArray(query.filters))
        query.filters = []

	const backHandler = useCallback(() => {
		if (pageMeta.prevPagePath)			
			history.push(pageMeta.prevPagePath)
	}, [history])

	const selectHandler = useCallback((value: string) => {
		history.push(value)
	}, [history])

	const preTab = useMemo(()=> {
			if (!pageMeta.selectableRoutes || pageMeta.selectableRoutes.length === 0) return false
			return (
				<Select
					style={{ width: '150px' }}
					defaultValue={(pageMeta.selectableRoutes.find( e => e.url === location.pathname) || {url: pageMeta.selectableRoutes[0].url}).url}
					onChange={ selectHandler }
				>
					{
						pageMeta.selectableRoutes.map(
							({url, title}) => <Select.Option key={url} value={url}>{title}</Select.Option>
						)
					}
				</Select>
			)
	}, [location.pathname, selectHandler])

	const [search, setSearch] = useState<string>(query.search || '')

	const setSearchQuery = (value: string) => {
		const newQuery = {...query}
		newQuery.search = value
        if ('page' in newQuery)
            newQuery.page = '1'

		history.replace({pathname: location.pathname, search: qs.stringify(newQuery)})
		setSearch(value)
	}

	// DRAWER =====================================================================================
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const {storage, setStorage} = useLocalStorage<LocalStorageProps>({
		language: "gujarati",
		developerMode: false,
		openIn: "In Site"
    })

    return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Media
				queries={{ narrow: { maxWidth: 799 } }}
			>
				{
					query => {
						if (query.narrow) return (
							<>
								<PageHeader
									// breadcrumb={ (!query.narrow && pageMeta.prevPagePath) ? pageMeta.breadcrumbs : undefined}
									onBack={pageMeta.prevPagePath ? backHandler : undefined}
									title={pageMeta.title}
									subTitle={pageMeta.subtitle}
									style={{ flexGrow: 0, flexShrink: 0, paddingBottom: 5, paddingLeft: 14 }}
								/>
								<div style={{ position: 'sticky', top: 0, padding: 0, margin: 0}}>
									<div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, flexShrink: 1, padding: 0, width: '100%', paddingLeft: 12, paddingRight: 12 }}>
										<Input.Search
											value={search}
											addonBefore={ preTab }
											onChange={ e => setSearchQuery(e.target.value)}
                                            size="large"
										/>
										<Button style={{ borderWidth: 0 }} size="large" shape="circle" onClick={ () => setIsDrawerOpen(true) }><SettingOutlined/></Button>
									</div>
									<Divider style={{ marginTop: 12, marginBottom: 12 }}/>
								</div>
							</>
						) 
						else return (
							<header>
								<div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'nowrap', width: '100%', overflowX: 'hidden'}}>
									<PageHeader
										// breadcrumb={ (!query.narrow && pageMeta.prevPagePath) ? pageMeta.breadcrumbs : undefined}
										onBack={pageMeta.prevPagePath ? backHandler : undefined}
										title={pageMeta.title}
										subTitle={pageMeta.subtitle}
										style={{ flexGrow: 0, flexShrink: 0, paddingBottom: 0 }}
									/>
									<h1 style={{ marginRight: 16, marginLeft: 16, marginBottom: 0, whiteSpace: 'nowrap' }}> Dada File Viewer </h1>
									<div style={{ flexGrow: 1, flexShrink: 1, padding: 16, paddingBottom: 0, minWidth: 300, maxWidth: 500, display: 'flex', flexDirection: 'row'}}>
										<Input.Search
											value={search}
											addonBefore={ preTab }
											onChange={ e => setSearchQuery(e.target.value)}
											size="large"
										/>
										<Button style={{ borderWidth: 0}} size="large" shape="circle" onClick={ () => setIsDrawerOpen(true) }><SettingOutlined/></Button>
									</div>
								</div>
								<Divider style={{ marginTop: 12, marginBottom: 12 }}/>
							</header>	
						)
					}
				}
			</Media>
			<PageContent {...storage} pageMeta={pageMeta} filterByDate={pageMeta.filterByDate} filterByTopics={pageMeta.filterByTopics} query={query}/>

			<Drawer
				title="Settings"
				placement="bottom"
				height="max(50%, min(75%, 300px))"
				visible={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			>
				<List>
					<span>
                        Download for <a href="https://play.google.com/store/apps/details?id=com.dadafileviewer"> Android </a> or
                        <a href="https://apps.apple.com/us/app/dada-file-viewer/id1478530708"> iPhone </a>
					</span>
					<List.Item>
						<span>
							<h3 style={{ display: 'inline'}}> Change primary language </h3>
						</span>
						<Switch onChange={checked => setStorage({language: checked ? "gujarati" : "english"})} checked={storage.language === "gujarati"} style={{ width: 100 }} checkedChildren="Gujarati" unCheckedChildren="English"/>
					</List.Item>
					<List.Item style={{ display: 'flex'}}>
						<span>
							<h3 style={{ flexGrow: 0, flexShrink: 0, display: 'inline'}}> Change how files are opened </h3>
							<MoreInfo info='In Site: (Recommended) Open PDFs in a browser based PDF viewer.Browser Default: Let your browser decide how to open PDFs'/>
						</span>
						<Select style={{ flexGrow: 1, flexShrink: 1, maxWidth: 200}} value={storage.openIn} onSelect={ v => setStorage({openIn: v})}>
							<Select.Option value="In Site"> In Site </Select.Option>
							<Select.Option value="Browser Default"> Browser Default </Select.Option>
							{/* <Select.Option value="Installed App"> Installed App </Select.Option> */}
						</Select>
					</List.Item>
					<List.Item>
						<span>
							<h3 style={{ display: 'inline'}}> Set theme </h3>
						</span>
						<Switch onChange={val => setDarkMode(val)} checked={darkMode} style={{ width: 100}} checkedChildren="Dark Mode" unCheckedChildren="Light Mode"/>
					</List.Item>
					{/* <List.Item>
						<span>
							<h3 style={{ display: 'inline'}}> Toggle developer mode </h3>
							<MoreInfo info="Enable this to view additional maintainence features. No login is currently needed to enable, but authorized actions will automatically prompt for authentication before completing."/>
						</span>
						<Switch onChange={val => setStorage({developerMode: val})} checked={storage.developerMode} style={{ width: 100 }} checkedChildren="Enabled" unCheckedChildren="Disabled"/>
					</List.Item> */}
				</List>
			</Drawer>

			<footer style={{ textAlign: 'center'}}>
				<Divider style={{ marginBottom: 5, marginTop: 14 }}/>
				<h5 style={{display: 'inline'}}> made with ❤ by <a href="https://github.com/marinater">samarth patel</a> for all dada's mahathmas</h5>
				<div style={{ paddingBottom: 7}}></div>
			</footer>
		</div>
    )
}

export type OpenInOptions = 'In Site' | 'Browser Default' | 'Installed App'
export type LanguageOptions = 'english' | 'gujarati'

interface DefaultParams { search?: string, page?: string, filters?: string[] }

interface LocalStorageProps {
	language: LanguageOptions
	developerMode: boolean
	openIn: OpenInOptions
}

export interface InjectedDefaultLayoutProps extends LocalStorageProps {
    pageMeta: PageMeta
	filterByTopics: boolean
    filterByDate: boolean
    query: DefaultParams
}

export interface PageMeta {
	prevPagePath?: string
	breadcrumbs?: any
	title: string
	subtitle?: string
	apiBaseURL: string
	selectableRoutes?: {url: string, title: string}[]
	filterByTopics: boolean
	filterByDate: boolean
}