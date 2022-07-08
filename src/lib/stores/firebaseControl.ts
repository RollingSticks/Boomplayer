import { writable } from "svelte/store";

import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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
			provider: new ReCaptchaV3Provider("6Ld1u9QeAAAAAPU912N6y5pZ8FhOzOB8Xm2sZ5W8"),
			isTokenAutoRefreshEnabled: true
		});
		settingUpAuth = false;
	} catch (err) {
		// don't
	}
}

const firestore: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const provider: GoogleAuthProvider = new GoogleAuthProvider();

auth.useDeviceLanguage();

export default writable({
	app: app,
	auth: auth,
	firestore: firestore,
	firebaseConfig: firebaseConfig,
	GoogleAuthProvider: provider,
});