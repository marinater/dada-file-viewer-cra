import React, {FC} from 'react'
import './App.css'

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import withFileViewer from 'layouts/withFileViewer'
import pageMetas from './pageMeta.json'
import { useStylesheet } from 'hooks/useStylesheet';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useAPI } from 'hooks/useAPI'
import { withDefaultLayout, InjectedDefaultLayoutProps } from 'layouts/withDefaultLayout'
import {List} from 'antd'

const toSafeName= (str: string) => '/viewer/' + str.toLowerCase().replace(/ /g, '-')

const Home: FC<InjectedDefaultLayoutProps> = () => {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, flexShrink: 1, overflow: 'auto' }}>
            {
                pageMetas.map(
                e => <List.Item key={e.title}><Link to={toSafeName(e.title)}> { e.title } </Link></List.Item>
                )
            }
        </div>
    )
}

const HomeWithLayout = withDefaultLayout(Home, {
    title: 'Home',
    apiBaseURL: '/api/home',
    filterByTopics: false,
    filterByDate: false
})

export const App = () => {
    const {storage: {prefersDarkMode: darkMode}, setStorage: setDarkModeStorage} = useLocalStorage({prefersDarkMode: true}, '__userDarkModeSetting__')
    // useStylesheet(darkMode)

    const darkModeProps = {darkMode, setDarkMode: (to: boolean) => setDarkModeStorage({prefersDarkMode: to})} 
    return <Router>
		<Switch>
			<Route exact path="/home">
                <HomeWithLayout {...darkModeProps}/>
			</Route>
			<Route exact path="/">
                <HomeWithLayout {...darkModeProps}/>
			</Route>
            {
                pageMetas.map(e => {
                    const Page = withFileViewer(e)
                    return (
                        <Route key={e.title} exact path={toSafeName(e.title)}>
                            <Page {...darkModeProps}/>
                        </Route>
                    )
                })
            }
			<Route>
				<div> 404: Could not find the requested page </div>
			</Route>
		</Switch>
	</Router>
}