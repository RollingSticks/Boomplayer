import firebaseControl from "$lib/stores/firebaseControl";

import type { FirebaseStore, Score } from "$lib/scripts/interfaces";
import { onMount } from "svelte";

let firebaseControlStore: FirebaseStore;

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

async function getSongs() {
	try {
		const firestore = await import("firebase/firestore");
		const doc = firestore.doc(
			firebaseControlStore.firestore,
			`users/${firebaseControlStore.auth.currentUser?.uid}`
		);

		return (await firestore.getDoc(doc)).data()?.songs ?? [];
	} catch (error) {
		onMount(() => {
			dispatchEvent(
				new ErrorEvent("error", {
					error: {
						message: "Kon nummers niet downloaden",
						retryable: true,
						error: error
					}
				})
			);
		});
	}
}

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
						songUid: uid,
						retryable: true
					}
				})
			);

			return undefined;
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

export { downloadScore, getSongs };
