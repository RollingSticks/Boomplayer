import firebaseControl from "$lib/stores/firebaseControl";

import type { FirebaseStore, Score } from "$lib/scripts/interfaces";

let firebaseControlStore: FirebaseStore;

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

async function downloadScore(uid: string): Promise<Score | undefined> {
	try {
		let data = JSON.parse(localStorage.getItem(uid) || "{}");
		if(!data.data || data.lastUpdated < Date.now() - 1000 * 60 * 60) {
			const firestore = await import("firebase/firestore");
			const doc = firestore.doc(
				firebaseControlStore.firestore,
				`songs/${uid}`
			);

			data = (await firestore.getDoc(doc)).data() ?? {};

			data.lastUpdated = new Date().getTime();
			localStorage.setItem(uid, JSON.stringify(data));

			if (!data.data) {
				dispatchEvent(
					new ErrorEvent("error", {
						error: {
							message: "Nummer bestaat niet meer",
							songUid: uid,
							retryable: true
						}
					})
				);

				return undefined;
			}
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
