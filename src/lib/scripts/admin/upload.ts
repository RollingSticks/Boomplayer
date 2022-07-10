import convert from "./converter";

import firebaseControlStore from "../../stores/firebaseControl";

import type { FirebaseControl, Score } from "../interfaces";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});

function generateUID(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		const r: number = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export default async function upload(mxl: Blob): Promise<string> {

	const data: Promise<Score> = convert(mxl);

	const firestore = await import("firebase/firestore");

	const uid = generateUID()

	firestore.setDoc(
		firestore.doc(firebaseControl.firestore, `songs/${uid}`), 
		{data: await data}
	);

    // upload zipped json to firebase, return url
    return uid
}