import * as zip from "@zip.js/zip.js";
import { XMLParser } from "fast-xml-parser"

const parser = new XMLParser();

async function unZip(data: Blob): Promise<string> {

	const reader = new zip.ZipReader(new zip.BlobReader(data));
	
	const entries: zip.Entry[] = await reader.getEntries();
	const text: string = entries[1].getData ? await entries[1].getData(new zip.TextWriter()) : "";

	reader.close();

	return text
}

export default async function decompress(data: Blob | string): Promise<string> {
	if (typeof data === 'string') {
		data = await (await fetch(data)).blob()
	}
	
	return parser.parse(await unZip(data))
}
