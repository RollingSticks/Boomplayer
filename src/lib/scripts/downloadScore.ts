import firebaseControlStore from "$lib/stores/firebaseControl";

import type { FirebaseControl, Score } from "$lib/scripts/interfaces";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => {
	firebaseControl = data;
});


async function downloadScore(uid: string): Promise<Score | undefined> {
	try {
		const firestore = await import("firebase/firestore");
		const doc = firestore.doc(firebaseControl.firestore, `songs/${uid}`);
		const data = (await firestore.getDoc(doc)).data() ?? {};

		if (!data.data) {
			dispatchEvent(new ErrorEvent("error", { error: {message: "Nummer bestaat niet meer", retryable: true} }));
		}
		return data.data;
	} catch (error) {
		dispatchEvent(new ErrorEvent("error", { error: {message: "Kon nummer niet downloaden", retryable: true, error: error} }));
	}
}

export { downloadScore };