import firebaseControlStore from "$lib/stores/firebaseControl";
import authStore from "$lib/stores/authStore";

import type { FirebaseControl, AuthStore } from "$lib/scripts/interfaces";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile /* sendEmailVerification */ } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => {
	firebaseControl = data;
});

let AuthStoreData: AuthStore;

authStore.subscribe((data: AuthStore) => {
	AuthStoreData = data;
});

async function signIn() {
	try {
		if(!firebaseControl.auth.currentUser) signInWithEmailAndPassword(firebaseControl.auth, AuthStoreData.userEmail, AuthStoreData.userPassword);
	} catch (error) {
		dispatchEvent(new ErrorEvent("error", { error: {message: "Er is iets mis gegaan bij het inloggen", retryable: true, error: error} }));
	}
}

async function signUp() {
	try {
		const userInfo = await createUserWithEmailAndPassword(firebaseControl.auth, AuthStoreData.userEmail, AuthStoreData.userPassword);

		updateProfile(userInfo.user, {
			displayName: AuthStoreData.displayName,
		});

		setDoc(doc(firebaseControl.firestore, `users/${userInfo.user.uid}`), {
			songs: []
		});
	} catch (error) {
		firebaseControl.auth.currentUser?.delete();
		dispatchEvent(new ErrorEvent("error", { error: {message: "Er is iets mis gegaan bij het aanmelden", retryable: true, error: error} }));
	}

	// sendEmailVerification(userInfo.user) // TODO: add email verification
}

async function signOut() {
	try {
		firebaseControl.auth.signOut();
	} catch (error) {
		dispatchEvent(new ErrorEvent("error", { error: {message: "Er is iets mis gegaan bij het uitloggen", retryable: true, error: error} }));
	}
}

async function deleteAccount() {
	try {
		if (firebaseControl.auth.currentUser) {
			firebaseControl.auth.currentUser.delete();

			deleteDoc(doc(firebaseControl.firestore, `users/${firebaseControl.auth.currentUser.uid}`));
		}
	} catch (error) {
		dispatchEvent(new ErrorEvent("error", { error: {message: "Er is iets mis gegaan bij het verwijderen van uw account", retryable: true, error: error} }));
	}
}

export { signIn, signUp, signOut, deleteAccount };