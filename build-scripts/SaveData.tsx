import fs from 'fs'
import path from 'path'
import {DataType, RowType} from './ParseCSVs'

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

const SaveData = async(data: DataType[], outPath: string) => {
    const remapped: { [key: string]: RowType[]} = {}

    for ( const entry of data ){
        remapped[entry.pageMeta['Page Title']] = entry.pageData.map( e => ({...e, uuid: uuidv4()}))
    }
    fs.writeFileSync(outPath, JSON.stringify(remapped, null, 4))
}

export {SaveData}