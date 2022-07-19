import firebaseControlStore from "$lib/stores/firebaseControl";

import type { FirebaseControl, Score } from "$lib/scripts/interfaces";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});



export default async function downloadScore(uid: string): Promise<Score> {
    const firestore = await import("firebase/firestore");
    const doc = firestore.doc(firebaseControl.firestore, `songs/${uid}`);
    const data = (await firestore.getDoc(doc)).data() ?? {} ;

    // if {} type is unknown, if that's the case the file doens't exist we could trigger an error event, we alse should send a message to analytics
    return data.data ?? {};
}