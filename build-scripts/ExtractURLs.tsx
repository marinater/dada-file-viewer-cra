import path from 'path'
import {ParseCSVs, DataType} from './ParseCSVs'
import fetch from 'node-fetch'

const run = async() => {
	const splitPath = path.resolve(__dirname, './tmp')
    const data = await ParseCSVs(splitPath)
    for (const {pageMeta, pageData} of data){
        for (const entry of pageData){
            console.log(entry["File URL"])
        }
    }
}

run()