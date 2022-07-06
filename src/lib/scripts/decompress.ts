import * as getStream from 'get-stream';
import * as pify from 'pify';
import * as yauzl from 'yauzl';

interface File {
	mode: number;
	mtime: number;
	path: string;
	type?: string;
	data?: Buffer;
	linkname?: string;
}

const getType = (entry: { externalFileAttributes: unknown; getLastModDate?: unknown; fileName?: unknown; versionMadeBy: number; }, mode: number) => {
	const IFMT = 61440;
	const IFDIR = 16384;
	const IFLNK = 40960;
	const madeBy = entry.versionMadeBy >> 8;

	if ((mode & IFMT) === IFLNK) {
		return 'symlink';
	}

	if ((mode & IFMT) === IFDIR || (madeBy === 0 && entry.externalFileAttributes === 16)) {
		return 'directory';
	}

	return 'file';
};

const extractEntry = (entry: { externalFileAttributes: any; getLastModDate?: any; fileName?: any; versionMadeBy: number; }, zip: { readEntry?: any; on?: any; openReadStream: { bind: (arg0: any) => any; }; close: () => void; }) => {
	const file: File = {
		mode: (entry.externalFileAttributes >> 16) & 0xFFFF,
		mtime: entry.getLastModDate(),
		path: entry.fileName
	};

	console.log(typeof entry.externalFileAttributes)

	file.type = getType(entry, file.mode);

	if (file.mode === 0 && file.type === 'directory') {
		file.mode = 493;
	}

	if (file.mode === 0) {
		file.mode = 420;
	}

	return pify(zip.openReadStream.bind(zip))(entry)
		.then(getStream.buffer)
		.then((buf: Buffer) => {
			file.data = buf;

			if (file.type === 'symlink') {
				file.linkname = buf.toString();
			}

			return file;
		})
		.catch((err: any) => {
			zip.close();
			throw err;
		});
};

const extractFile = (zip: { readEntry?: any; on?: any; openReadStream: { bind: (arg0: any) => any; }; close: () => void; }) => new Promise<File[]>((resolve, reject) => {
	const files: File[] = [];

	zip.readEntry();

	zip.on('entry', (entry: any) => {
		extractEntry(entry, zip)
			.then((file) => {
				files.push(file);
				zip.readEntry();
			});
	});

	zip.on('error', reject);
	zip.on('end', () => resolve(files));
});

async function decompressUnzip(buf: Buffer): Promise<File[]> {
	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError(`Expected a Buffer, got ${typeof buf}`));
	}

	const zip = await pify(yauzl.fromBuffer)(buf, { lazyEntries: true });
	return extractFile(zip);
}


export default async function decompress(buf: Buffer | string) {
	console.log("decom")
	if (typeof buf === 'string') {
		buf = Buffer.from(await (await fetch(buf)).arrayBuffer())
	}
	
	return (await decompressUnzip(buf))[1].data
}
