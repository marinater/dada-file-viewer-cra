import fs from 'fs'
import path from 'path'
import {DataType, RowType} from './ParseCSVs'

const SaveData = async(data: DataType[], outPath: string) => {
    const remapped: { [key: string]: RowType[]} = {}
    for ( const entry of data ){
        remapped[entry.pageMeta['Page Title']] = entry.pageData
    }

    fs.writeFileSync(outPath, JSON.stringify(remapped, null, 4))
}

export {SaveData}