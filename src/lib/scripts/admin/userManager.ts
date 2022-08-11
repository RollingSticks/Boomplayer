import { collection, doc, getDocs, runTransaction, type DocumentData } from "firebase/firestore";
import firebaseControlStore from "$lib/stores/firebaseControl";
import type { FirebaseControl } from "$lib/scripts/interfaces";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});

async function addSong(userUid: string, songUid: string) { // TODO: add error handling
    await runTransaction(firebaseControl.firestore, async (transaction) => {
        const userRef = doc(firebaseControl.firestore, `users/${userUid}`);
        const userInfo = (await transaction.get(userRef)).data() ?? {songs: []};
        if (userInfo["songs"]) userInfo["songs"].push(songUid);

        transaction.update(userRef, { songs: userInfo.songs });
    }).catch(error => {
        console.log(error);
    });
}

async function removeSong(userUid: string, songUid: string) { // TODO: add error handling
    await runTransaction(firebaseControl.firestore, async (transaction) => {
        const userRef = doc(firebaseControl.firestore, `users/${userUid}`);
        const userInfo = (await transaction.get(userRef)).data() ?? {};

        if (userInfo["songs"]) {
            delete userInfo["songs"][songUid];
            transaction.update(userRef, { songs: userInfo.songs });
        }
    }).catch(error => {
        console.log(error);
    });
}

async function getUsers(): Promise<DocumentData[]> { // TODO: add error handling
    const usersCollection = await getDocs(collection(firebaseControl.firestore, "users"));

    const users: DocumentData[] = [];

	usersCollection.forEach((doc) => {
        const data = doc.data();
        data.uid = doc.id;
		users.push(data);
	});

    console.log(users)

    return users;
}


export { addSong, getUsers, removeSong }