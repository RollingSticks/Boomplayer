import convert from "$lib/scripts/admin/converter";

import firebaseControl from "$lib/stores/firebaseControl";

import type { FirebaseStore, Score, ScoreRaw } from "$lib/scripts/interfaces";
import { generateUID } from "$lib/scripts/util";
import { rawToScore } from "./scoreInfoFinder";

let firebaseControlStore: FirebaseStore;

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

async function upload(mxl: Blob): Promise<string> {
	const firestore_ = import("firebase/firestore");

	// load data
	const data: ScoreRaw | undefined = (await convert(mxl)) ?? undefined;

	if (!data) return "";

	// generate uid
	const uid = generateUID();

	if (!uid) return "";

	// format data

	const score: Score = rawToScore(data);
	console.log(score);

	// upload data to firebase
	const firestore = await firestore_;

	try {
		await firestore.setDoc(
			firestore.doc(firebaseControlStore.firestore, `songs/${uid}`),
			{ data: score }
		);
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet uploaden",
					retryable: true,
					error: error
				}
			})
		);
	}

	// upload zipped json to firebase, return url
	return uid;
}

async function uploadScore(score: Score): Promise<string> {
	const firestore_ = import("firebase/firestore");

	// generate uid
	const uid = generateUID();

	if (!uid) return "";

	// upload data to firebase
	const firestore = await firestore_;

	try {
		await firestore.setDoc(
			firestore.doc(firebaseControlStore.firestore, `songs/${uid}`),
			{ data: score }
		);
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet uploaden",
					retryable: true,
					error: error
				}
			})
		);
	}

	// upload zipped json to firebase, return url
	return uid;
}

export { upload, uploadScore };
