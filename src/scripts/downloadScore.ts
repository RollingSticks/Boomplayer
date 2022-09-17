import firebaseControl from "$lib/stores/firebaseControl";

import type { FirebaseStore, Score } from "$lib/scripts/interfaces";

let firebaseControlStore: FirebaseStore;

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

async function downloadScore(uid: string): Promise<Score | undefined> {
	try {
		const firestore = await import("firebase/firestore");
		const doc = firestore.doc(
			firebaseControlStore.firestore,
			`songs/${uid}`
		);
		const data = (await firestore.getDoc(doc)).data() ?? {};

		if (!data.data) {
			dispatchEvent(
				new ErrorEvent("error", {
					error: {
						message: "Nummer bestaat niet meer",
						retryable: true
					}
				})
			);
		}
		return data.data;
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet downloaden",
					retryable: true,
					error: error
				}
			})
		);
	}
}

export { downloadScore };
