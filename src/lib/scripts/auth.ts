import firebaseControl from "$lib/stores/firebaseControl";
import authData from "$lib/stores/authData";

import type {
	FirebaseStore,
	AuthStore,
	AppStore
} from "$lib/scripts/interfaces";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	updatePassword /* sendEmailVerification */,
	updateEmail,
	signInWithPopup
} from "firebase/auth";
import { doc, setDoc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import {
	ref,
	uploadBytesResumable,
	type StorageReference,
	type UploadTask
} from "firebase/storage";
import { onMount } from "svelte";
import { FirebaseError } from "firebase/app";
import appData from "$lib/stores/appData";

let firebaseControlStore: FirebaseStore;
let appDataStore: AppStore;

appData.subscribe((data: AppStore) => {
	appDataStore = data;
});

firebaseControl.subscribe((data) => {
	firebaseControlStore = data;
});

let AuthDataStore: AuthStore;

authData.subscribe((data: AuthStore) => {
	AuthDataStore = data;
});

const notSignedIn = "No user signed in";

async function signIn(trylogin = false) {
	try {
		if (!firebaseControlStore.auth.currentUser) {
			await signInWithEmailAndPassword(
				firebaseControlStore.auth,
				AuthDataStore.userEmail,
				AuthDataStore.userPassword
			);
		}
		if (firebaseControlStore.auth.currentUser) {
			localStorage.setItem(
				"uid",
				firebaseControlStore.auth.currentUser.uid
			);
			location.href = "/home";
		}
	} catch (error: unknown) {
		if (!trylogin) {
			if (!(error instanceof FirebaseError)) return;
			let errorMessage = "Er is iets mis gegaan bij het inloggen";
			if (error.code === "auth/user-not-found")
				errorMessage = "Gebruiker niet gevonden";
			else if (error.code === "auth/wrong-password")
				errorMessage = "Verkeerd wachtwoord";
			else if (error.code === "auth/invalid-email")
				errorMessage = "Ongeldig emailadres";
			else errorMessage = "Er is iets mis gegaan bij het inloggen";

			dispatchEvent(
				new ErrorEvent("error", {
					error: {
						message: errorMessage,
						error: error
					}
				})
			);
		} else {
			dispatchEvent(
				new ErrorEvent("error", {
					error: {
						message: "Email address in gebruik",
						error: error
					}
				})
			);
		}
	}
}

async function signUp() {
	try {
		const userInfo = await createUserWithEmailAndPassword(
			firebaseControlStore.auth,
			AuthDataStore.userEmail,
			AuthDataStore.userPassword
		);

		AuthDataStore.newUserDisplayName =
			AuthDataStore.displayName === ""
				? AuthDataStore.userEmail
						.split("@")[0]
						.replace("-", " ")
						.replace("_", " ")
				: AuthDataStore.displayName;

		await updateProfile(userInfo.user, {
			displayName: AuthDataStore.newUserDisplayName
		});

		await setDoc(
			doc(firebaseControlStore.firestore, `users/${userInfo.user.uid}`),
			{
				songs: [],
				displayName: AuthDataStore.newUserDisplayName
			}
		);

		if (firebaseControlStore.auth.currentUser) {
			localStorage.setItem(
				"uid",
				firebaseControlStore.auth.currentUser.uid
			);
		}

		return userInfo;
	} catch (error) {
		if (error.code === "auth/email-already-in-use") signIn(true);
		else {
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
	}

	// sendEmailVerification(userInfo.user) // TODO: add email verification
}

async function signinWithGoogle(redirect = true) {
	try {
		await signInWithPopup(
			firebaseControlStore.auth,
			firebaseControlStore.googleProvider
		);

		const userDoc = doc(
			firebaseControlStore.firestore,
			`users/${firebaseControlStore.auth.currentUser?.uid}`
		);
		if (!(await getDoc(userDoc)).exists()) {
			await setDoc(userDoc, {
				songs: [],
				displayName: firebaseControlStore.auth.currentUser?.displayName,
				pfp: firebaseControlStore.auth.currentUser?.photoURL,
				email: firebaseControlStore.auth.currentUser?.email
			});
		}
		if (firebaseControlStore.auth.currentUser) {
			localStorage.setItem(
				"uid",
				firebaseControlStore.auth.currentUser.uid
			);
			if (redirect) location.href = "/home";
		}
	} catch (error: unknown) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"We konden u helaas niet inloggen met uw Google account",
					error: error
				}
			})
		);
	}
}

async function signOut() {
	try {
		await firebaseControlStore.auth.signOut();
		if (firebaseControlStore.auth.currentUser) location.href = "/";
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
		await deleteDoc(
			doc(
				firebaseControlStore.firestore,
				`users/${
					firebaseControlStore.auth.currentUser?.uid ??
					localStorage.getItem("uid")
				}`
			)
		);

		firebaseControlStore.auth.currentUser?.delete();
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
	} catch (error: unknown) {
		if (!(error instanceof FirebaseError)) return;
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
	if (appDataStore.userInfo?.providerData[0].providerId !== "google.com")
		await signIn();
	else await signinWithGoogle(false);

	try {
		if (firebaseControlStore.auth.currentUser) {
			await updateEmail(
				firebaseControlStore.auth.currentUser,
				AuthDataStore.newUserEmail
			);

			await updateDoc(
				doc(
					firebaseControlStore.firestore,
					`users/${firebaseControlStore.auth.currentUser.uid}`
				),
				{
					email: AuthDataStore.newUserEmail
				}
			);
		} else {
			throw new Error(notSignedIn);
		}
	} catch (error: unknown) {
		if (!(error instanceof FirebaseError)) return;
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

			await updateDoc(
				doc(
					firebaseControlStore.firestore,
					`users/${firebaseControlStore.auth.currentUser.uid}`
				),
				{
					displayName: AuthDataStore.newUserDisplayName
				}
			);
		} else {
			throw new Error(notSignedIn);
		}
	} catch (error) {
		if (!(error instanceof FirebaseError)) return;
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
	let finishedUpload = false;
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

			const uploadTask: UploadTask = uploadBytesResumable(
				pfpRef,
				compressedPFP
			);

			uploadTask.on("state_changed", async (snapshot) => {
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

				if (
					snapshot.bytesTransferred === compressedPFP.size &&
					!finishedUpload
				) {
					finishedUpload = true;

					dispatchEvent(
						new CustomEvent("updatingPFP", {
							detail: { progress: 99, message: "profiel updaten" }
						})
					);

					if (!firebaseControlStore.auth.currentUser) return;
					await updateProfile(firebaseControlStore.auth.currentUser, {
						photoURL: `https://firebasestorage.googleapis.com/v0/b/boomplayerdev.appspot.com/o/pfps%2F${firebaseControlStore.auth.currentUser.uid}?alt=media`
					});

					await updateDoc(
						doc(
							firebaseControlStore.firestore,
							`users/${firebaseControlStore.auth.currentUser.uid}`
						),
						{
							pfp: `https://firebasestorage.googleapis.com/v0/b/boomplayerdev.appspot.com/o/pfps%2F${firebaseControlStore.auth.currentUser.uid}?alt=media`
						}
					);

					dispatchEvent(
						new CustomEvent("updatingPFP", {
							detail: { progress: 100, message: "klaar!" }
						})
					);
				}
			});
		} else {
			throw new Error(notSignedIn);
		}
	} catch (error: unknown) {
		if (!(error instanceof FirebaseError)) return;
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message:
						"Er is iets mis gegaan bij het updaten van uw profiel foto",
					error: error,
					promptSignin: (error.message ?? "") === notSignedIn
				}
			})
		);
	}
}

async function getUserData() {
	try {
		const firestore = await import("firebase/firestore");

		const userID = localStorage.getItem("uid");

		const doc = firestore.doc(
			firebaseControlStore.firestore,
			`users/${userID ?? firebaseControlStore.auth.currentUser?.uid}`
		);

		appDataStore.userData = (await firestore.getDoc(doc)).data();

		dispatchEvent(new CustomEvent("HideLoader"));

		return appDataStore.userData;
	} catch (error) {
		onMount(() => {
			dispatchEvent(
				new ErrorEvent("error", {
					error: {
						message: "Kon gebruikers informatie niet ophalen",
						retriable: true,
						error: error
					}
				})
			);
		});
	}
}

export {
	signIn,
	signUp,
	signinWithGoogle,
	signOut,
	deleteAccount,
	changePassword,
	changeEmail,
	changeDisplayName,
	uploadPFP,
	getUserData
};
