import neatCSV from 'neat-csv'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

export interface RowType {
	"Language": string
	"Month": string
	"Date": string
	"Year": string
	"Topics (Separate with dash)": string
	"Title in English": string
	"Title in Original Language": string
	"File URL": string
}

export interface MetaType {
	"Page Title": string
	"Page Sub Title": string
	"Previous Page URL": string
	"Filter By Topics": string
	"Filter by Date": string 
}

export interface DataType {
	pageMeta: MetaType
	pageData: RowType[]
}

const ParseCSVs = async(splitPath: string) => {
	const dir = fs.readdirSync(splitPath)
	const data = [] as DataType[]

	for (const filename of dir){
		if (!filename.endsWith('.csv')) continue

		const fileStream = fs.createReadStream(path.resolve(splitPath, filename))
		const reader = readline.createInterface({ input: fileStream, crlfDelay: Infinity })
		
		let i = 0
		let firstTwoLines = ''
		let rest = ''

		for await (const line of reader){
			if ( i < 2 )
				firstTwoLines += line + '\n'
			else
				rest += line + '\n'

			i++
		}

		data.push({
			pageMeta: (await neatCSV<MetaType>(firstTwoLines))[0],
			pageData: await neatCSV<RowType>(rest)
		})
	}

	return data
}

export {ParseCSVs}

//xargs -n1 -P 10 curl -o /dev/null --silent --head --write-out '%{http_code}\t%{url_effective}\n' < ./build-scripts/tmp/urls.txt | sed -n '/^200\t/!p'