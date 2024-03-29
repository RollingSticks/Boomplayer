import {
	collection,
	doc,
	getDocs,
	runTransaction,
	type DocumentData
} from "firebase/firestore";
import firebaseControl from "$lib/stores/firebaseControl";
import type { FirebaseStore } from "$lib/scripts/interfaces";
import { sendNotification } from "$lib/scripts/notificationHandler";

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
				const userData = (await transaction.get(userRef)).data() ?? {};
				if (userData.songs) userData.songs.push(songUid);

				const song = JSON.parse(localStorage.getItem(songUid) ?? "{}");

				if (userData.notificationToken) sendNotification(userData.notificationToken, {
					title: "Je hebt een nieuw nummer!",
					body: song.artist
						? "Je docent heeft een nieuw nummer toegevoegd: " +
						  song.title +
						  " van " +
						  song.artist
						: "Je docent heeft " +
						  song.title +
						  " toegevoegd aan je muziek lijst"
				});

				transaction.update(userRef, {
					songs: userData.songs ?? [songUid]
				});
			}
		);
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet toevoegen aan gebruiker",
					retriable: true,
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
					userInfo.songs.splice(userInfo.songs.indexOf(songUid), 1);
					transaction.update(userRef, { songs: userInfo.songs });
				}
			}
		);
	} catch (error) {
		console.log(error);
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet verwijderen van gebruiker",
					retriable: true,
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
					retriable: true,
					error: error
				}
			})
		);

		return [];
	}
}

async function getAllSongs() {
	const songs: DocumentData[] = [];

	try {
		const songsCollection = await getDocs(
			collection(firebaseControlStore.firestore, "songs")
		);
		songsCollection.forEach((doc) => {
			const data = doc.data();
			data.uid = doc.id;
			songs.push(data);
		});

		return songs;
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon geen nummers ophalen",
					retriable: true,
					error: error
				}
			})
		);

		return undefined;
	}
}

export { addSong, getUsers, removeSong, getAllSongs };
