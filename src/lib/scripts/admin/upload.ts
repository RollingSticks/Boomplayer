import convert from "$lib/scripts/admin/converter";

import firebaseControlStore from "$lib/stores/firebaseControl";

import type { FirebaseControl, Score } from "$lib/scripts/interfaces";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});

function generateUID(): string {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for ( let i = 0; i < 16; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
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

export { generateUID };