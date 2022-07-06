import * as zip from "@zip.js/zip.js";

async function unZip(data: Blob) {

	const reader = new zip.ZipReader(new zip.BlobReader(data));
	
	const entries: zip.Entry[] = await reader.getEntries();
	const text = entries[1].getData ? entries[1].getData(new zip.TextWriter()) : null;

	reader.close();

	return await text
}

export default async function decompress(data: Blob | string) {
	if (typeof data === 'string') {
		data = await (await fetch(data)).blob()
	}
	
	return (await unZip(data))
}
