import {
	collection,
	doc,
	getDocs,
	runTransaction,
	type DocumentData
} from "firebase/firestore";
import firebaseControl from "$lib/stores/firebaseControl";
import type { FirebaseStore } from "$lib/scripts/interfaces";

let firebaseControlStore: FirebaseStore;

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

async function addSong(userUid: string, songUid: string) {
	try {
		await runTransaction(
			firebaseControlStore.firestore,
			async (transaction) => {
				const userRef = doc(
					firebaseControlStore.firestore,
					`users/${userUid}`
				);
				const userInfo = (await transaction.get(userRef)).data() ?? {};
				if (userInfo.songs) userInfo.songs.push(songUid);

				transaction.update(userRef, {
					songs: userInfo.songs ?? [songUid]
				});
			}
		);
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet toevoegen aan gebruiker",
					retryable: true,
					error: error
				}
			})
		);
	}
}

async function removeSong(userUid: string, songUid: string) {
	try {
		await runTransaction(
			firebaseControlStore.firestore,
			async (transaction) => {
				const userRef = doc(
					firebaseControlStore.firestore,
					`users/${userUid}`
				);
				const userInfo = (await transaction.get(userRef)).data() ?? {};

				if (userInfo.songs) {
					delete userInfo.songs[songUid];
					transaction.update(userRef, { songs: userInfo.songs });
				}
			}
		);
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet verwijderen van gebruiker",
					retryable: true,
					error: error
				}
			})
		);
	}
}

async function getUsers(): Promise<DocumentData[]> {
	const users: DocumentData[] = [];

	try {
		const usersCollection = await getDocs(
			collection(firebaseControlStore.firestore, "users")
		);
		usersCollection.forEach((doc) => {
			const data = doc.data();
			data.uid = doc.id;
			users.push(data);
		});

		return users;
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon geen gebruikers ophalen",
					retryable: true,
					error: error
				}
			})
		);

		return [];
	}
}

async function getAllSongs() {
	return undefined;
}

export { addSong, getUsers, removeSong, getAllSongs };
