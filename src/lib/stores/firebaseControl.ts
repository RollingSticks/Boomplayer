import { writable } from "svelte/store";

import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, type Auth } from "firebase/auth";

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

auth.onAuthStateChanged(user => {
	if(user) {
		console.log("user signed in");
	} else {
		console.log("user signed out");
	}
})

export default writable({
	app: app,
	firestore: firestore,
	firebaseConfig: firebaseConfig,
	auth: auth
});