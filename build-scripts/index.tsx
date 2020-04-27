import path from 'path'
import {SplitExcel} from './ExcelSplitter'
import {ParseCSVs} from './ParseCSVs'
import {GenerateAPI, GenerateJSON} from './Generate'
import {SaveData} from './SaveData'

const run = async() => {
	// SPLIT EXCEL FILE INTO MULTIPLE CSVs
	const excelFile = path.resolve(__dirname, './DadaFileViewer.xlsx')
	const splitPath = path.resolve(__dirname, './tmp')
	await SplitExcel(excelFile, splitPath)

	// CONVERT CSV's INTO JSON
    const data = await ParseCSVs(splitPath)

    // GENERATE PAGES FROM DATA
    const pagesOutPath = path.resolve(__dirname, '../src/pageMeta.json')
    await GenerateJSON(data, pagesOutPath)

    // GENERATE PAGES FROM DATA
    const apiDirectory = path.resolve(__dirname, '../api')
    await GenerateAPI(data, apiDirectory)

    // GENERATE JSON FROM DATA
    const dataOutPath = path.resolve(__dirname, '../data/general2.json')
    await SaveData(data, dataOutPath)
}

run()