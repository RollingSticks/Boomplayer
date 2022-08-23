import firebaseControl from "$lib/stores/firebaseControl";
import authData from "$lib/stores/authData";

import type { FirebaseStore, AuthStore } from "$lib/scripts/interfaces";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	updatePassword /* sendEmailVerification */,
	updateEmail
} from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
	type StorageReference
} from "firebase/storage";

let firebaseControlStore: FirebaseStore;

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

let AuthDataStore: AuthStore;

authData.subscribe((data: AuthStore) => {
	AuthDataStore = data;
});

const notSignedIn = "No user signed in";

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
		} else {
			throw new Error(notSignedIn);
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het verwijderen van uw account",
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
			throw new Error(notSignedIn);
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het updaten van uw wachtwoord",
					error: error,
					promptSignin: (error.message ?? "") === notSignedIn
				}
			})
		);
	}
}

async function changeEmail() {
	try {
		if (firebaseControlStore.auth.currentUser) {
			await updateEmail(
				firebaseControlStore.auth.currentUser,
				AuthDataStore.newUserEmail
			);
		} else {
			throw new Error(notSignedIn);
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het updaten van uw email",
					error: error,
					promptSignin: (error.message ?? "") === notSignedIn
				}
			})
		);
	}
}

async function changeDisplayName() {
	try {
		if (firebaseControlStore.auth.currentUser) {
			await updateProfile(firebaseControlStore.auth.currentUser, {
				displayName: AuthDataStore.newUserDisplayName
			});
		} else {
			throw new Error(notSignedIn);
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het updaten van uw naam",
					error: error,
					promptSignin: (error.message ?? "") === notSignedIn
				}
			})
		);
	}
}

async function uploadPFP(pfp: File) {
	try {
		if (firebaseControlStore.auth.currentUser) {
			dispatchEvent(new CustomEvent("updatingPFP"));
			const compressedPFP = await imageCompression(pfp, {
				maxSizeMB: 0.05,
				maxWidthOrHeight: 512,
				useWebWorker: true,
				onProgress: (data) => {
					dispatchEvent(
						new CustomEvent("updatingPFP", {
							detail: {
								progress: data / 2,
								message: "comprimeren"
							}
						})
					);
				}
			});

			const pfpRef: StorageReference = ref(
				firebaseControlStore.storage,
				`pfps/${firebaseControlStore.auth.currentUser.uid}`
			);

			uploadBytesResumable(pfpRef, compressedPFP).on(
				"state_changed",
				(snapshot) => {
					dispatchEvent(
						new CustomEvent("updatingPFP", {
							detail: {
								progress:
									50 +
									(snapshot.bytesTransferred /
										compressedPFP.size) *
										49,
								message: "uploaden"
							}
						})
					);
				}
			);

			dispatchEvent(
				new CustomEvent("updatingPFP", {
					detail: { progress: 99, message: "profiel updaten" }
				})
			);
			await updateProfile(firebaseControlStore.auth.currentUser, {
				photoURL: await getDownloadURL(pfpRef)
			});

			dispatchEvent(
				new CustomEvent("updatingPFP", {
					detail: { progress: 100, message: "klaar!" }
				})
			);
		} else {
			throw new Error(notSignedIn);
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het updaten van uw naam",
					error: error,
					promptSignin: (error.message ?? "") === notSignedIn
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
	changeEmail,
	changeDisplayName,
	uploadPFP
};
