import firebaseControlStore from "$lib/stores/firebaseControl";

import type { FirebaseControl } from "$lib/scripts/interfaces";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});



export  default async function downloadScore(uid: string) {
    const firestore = await import("firebase/firestore");
    const doc = firestore.doc(firebaseControl.firestore, `songs/${uid}`);
    const data = (await firestore.getDoc(doc)).data();
    return data;
}