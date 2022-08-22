import firebaseControl from "$lib/stores/firebaseControl";
import authData from "$lib/stores/authData";

import type { FirebaseStore, AuthStore } from "$lib/scripts/interfaces";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	updatePassword /* sendEmailVerification */
} from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

let firebaseControlStore: FirebaseStore;

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

let AuthDataStore: AuthStore;

authData.subscribe((data: AuthStore) => {
	AuthDataStore = data;
});

async function signIn() {
	try {
		if (!firebaseControlStore.auth.currentUser)
			await signInWithEmailAndPassword(
				firebaseControlStore.auth,
				AuthDataStore.userEmail,
				AuthDataStore.userPassword
			);
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Er is iets mis gegaan bij het inloggen",
					retryable: true,
					error: error
				}
			})
		);
	}
}

async function signUp() {
	try {
		const userInfo = await createUserWithEmailAndPassword(
			firebaseControlStore.auth,
			AuthDataStore.userEmail,
			AuthDataStore.userPassword
		);

		await updateProfile(userInfo.user, {
			displayName: AuthDataStore.displayName
		});

		await setDoc(
			doc(firebaseControlStore.firestore, `users/${userInfo.user.uid}`),
			{
				songs: []
			}
		);
	} catch (error) {
		firebaseControlStore.auth.currentUser?.delete();
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Er is iets mis gegaan bij het aanmelden",
					retryable: true,
					error: error
				}
			})
		);
	}

	// sendEmailVerification(userInfo.user) // TODO: add email verification
}

async function signOut() {
	try {
		await firebaseControlStore.auth.signOut();
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Er is iets mis gegaan bij het uitloggen",
					retryable: true,
					error: error
				}
			})
		);
	}
}

async function deleteAccount() {
	try {
		if (firebaseControlStore.auth.currentUser) {
			await firebaseControlStore.auth.currentUser.delete();

			await deleteDoc(
				doc(
					firebaseControlStore.firestore,
					`users/${firebaseControlStore.auth.currentUser.uid}`
				)
			);
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het verwijderen van uw account",
					retryable: true,
					error: error
				}
			})
		);
	}
}

async function changePassword() {
	try {
		if (firebaseControlStore.auth.currentUser) {
			updatePassword(
				firebaseControlStore.auth.currentUser,
				AuthDataStore.newUserPassword
			);
		} else {
			throw new Error("No user signed in");
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het updaten van uw wachtwoord",
					retryable: true,
					error: error
				}
			})
		);
	}
}

async function updateDisplayName() {
	try {
		if (firebaseControlStore.auth.currentUser) {
			await updateProfile(firebaseControlStore.auth.currentUser, {
				displayName: AuthDataStore.displayName
			});
		} else {
			throw new Error("No user signed in");
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het updaten van uw naam",
					retryable: true,
					error: error
				}
			})
		);
	}
}

export {
	signIn,
	signUp,
	signOut,
	deleteAccount,
	changePassword,
	updateDisplayName
};
