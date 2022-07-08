import * as zip from "@zip.js/zip.js";
import decompress from "../decompress";

import firebaseControlStore from "../../stores/firebaseControl";
import type { FirebaseControl, Score } from "../interfaces";

let firebaseControl: FirebaseControl;

function generateUID(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		const r: number = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});

async function zipIt(data: string | object): Promise<Blob> {
	const blobWriter = new zip.BlobWriter("json/zip");
	const writer = new zip.ZipWriter(blobWriter);

	await writer.add("song.json", new zip.TextReader(data.toString()));

	await writer.close();

	return blobWriter.getData();
}

export default async function upload(mxl: Blob | string | Score): Promise<string> {

    // convert mxl => json => zipped json
	let data

	if (typeof mxl === "object") {
		data = zipIt(mxl);
	} else {
		data = zipIt(JSON.stringify(decompress(mxl)))
	}

	const firestore = await import("firebase/firestore");

	const songReference = firestore.doc(firebaseControl.firestore, `songs/${generateUID()}`)

	firestore.setDoc(songReference, {data: await data})

    // upload zipped json to firebase, return url
    return ""
}