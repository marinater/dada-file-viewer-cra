import Excel from 'exceljs'
import path from 'path'
import fs from 'fs'

const SplitExcel = async(filepath: string, splitDirectory: string) => {
	try {
		fs.rmdirSync(splitDirectory, {recursive: true})
	}
	catch (e){
		console.log(e)
	}
	finally {
		fs.mkdirSync(splitDirectory)
	}

	const workbook = new Excel.Workbook()
	await workbook.xlsx.readFile(filepath)
	
	for await ( const {name, id} of workbook.worksheets){
        const sheetName = name.replace(/ /g, '_')
		await workbook.csv.writeFile(path.resolve(splitDirectory, sheetName + '.csv'), { sheetId: id })
	}
}

export {SplitExcel}