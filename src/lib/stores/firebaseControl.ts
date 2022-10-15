import { writable } from "svelte/store";

import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import type { FirebaseStore } from "$lib/scripts/interfaces";
import { onMount } from "svelte";

const firebaseConfig = {
	apiKey: "AIzaSyDx-tRxRGBrSSQxSzA-0oo4Hc5HRJ_JhFU",
	authDomain: "boomplayerdev.firebaseapp.com",
	projectId: "boomplayerdev",
	storageBucket: "boomplayerdev.appspot.com",
	messagingSenderId: "279854840176",
	appId: "1:279854840176:web:f6351675e25fc8369cb7b5",
	measurementId: "G-K2SEJJN5H3"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

let settingUpAuth = true;
while (settingUpAuth) {
	try {
		initializeAppCheck(app, {
			provider: new ReCaptchaV3Provider(
				"6Ld1u9QeAAAAAPU912N6y5pZ8FhOzOB8Xm2sZ5W8"
			),
			isTokenAutoRefreshEnabled: true
		});
		settingUpAuth = false;
	} catch (err) {
		// don't
	}
}

const firestore: Firestore = getFirestore(app);

const storage: FirebaseStorage = getStorage(app);

const auth: Auth = getAuth(app);

export default writable<FirebaseStore>({
	app: app,
	firestore: firestore,
	firebaseConfig: firebaseConfig,
	auth: auth,
	storage: storage,
	googleProvider: new GoogleAuthProvider()
});
