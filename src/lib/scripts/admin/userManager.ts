import { collection, doc, getDocs, arrayUnion, arrayRemove, type DocumentData, updateDoc, setDoc } from "firebase/firestore";
import firebaseControlStore from "$lib/stores/firebaseControl";
import type { FirebaseControl } from "$lib/scripts/interfaces";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});

function addSong(userUid: string, songUid: string) {
    setDoc(doc(firebaseControl.firestore, `users/${userUid}`), {
        songs: arrayUnion(songUid)
    });
}

function removeSong(userUid: string, songUid: string) {
    updateDoc(doc(firebaseControl.firestore, `users/${userUid}`), {
        songs: arrayRemove(songUid)
    });
}

async function getUsers(): Promise<DocumentData[]> {
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