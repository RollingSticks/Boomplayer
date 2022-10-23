import firebaseControl from "$lib/stores/firebaseControl";
import authData from "$lib/stores/authData";

import type { FirebaseStore, AuthStore } from "$lib/scripts/interfaces";
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
	} catch (error) {
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
	}
}

async function signUp() {
	try {
		const userInfo = await createUserWithEmailAndPassword(
			firebaseControlStore.auth,
			AuthDataStore.userEmail,
			AuthDataStore.userPassword
		);

		const dpname = AuthDataStore.userEmail
			.split("@")[0]
			.replace("-", " ")
			.replace("_", " ");

		AuthDataStore.displayName =
			AuthDataStore.displayName === ""
				? dpname
				: AuthDataStore.displayName;

		await updateProfile(userInfo.user, {
			displayName: AuthDataStore.displayName
		});

		await setDoc(
			doc(firebaseControlStore.firestore, `users/${userInfo.user.uid}`),
			{
				songs: [],
				displayName: AuthDataStore.displayName,
				setup: false
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
				`users/${firebaseControlStore.auth.currentUser?.uid ?? localStorage.getItem("uid")}`
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
	await signinWithGoogle(false);
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
		console.log(error);
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

async function getUserInfo() {
	try {
		const firestore = await import("firebase/firestore");

		const userID = localStorage.getItem("uid");

		const doc = firestore.doc(
			firebaseControlStore.firestore,
			`users/${userID ?? firebaseControlStore.auth.currentUser?.uid}`
		);

		const userInfo = (await firestore.getDoc(doc)).data();

		return userInfo;
	} catch (error) {
		onMount(() => {
			dispatchEvent(
				new ErrorEvent("error", {
					error: {
						message: "Kon nummers niet downloaden",
						retryable: true,
						error: error
					}
				})
			);
		});
	}
}

async function Setup() {
	let file;

	const failsafe = addEventListener("error", async (event: ErrorEvent) => {
		await deleteAccount();

		setTimeout(() => {
			window.location.href = "/join";
		}, 1500);
	});


	try {
		if (AuthDataStore.newProfilePicture === "") {
			dispatchEvent(
				new ErrorEvent("error", {
					error: {
						message: "U heeft geen profiel foto geselecteerd"
					}
				})
			);


			return;
		} else {
			file = await fetch(AuthDataStore.newProfilePicture).then((r) =>
				r.blob()
			);

			await uploadPFP(
				new File([file], "pfp." + file.type.split("/")[1], { type: file.type })
			);

			await changeDisplayName();
		}
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Er is iets mis gegaan bij het opzetten van uw account",
					error: error
				}
			})
		);

		await deleteAccount();
		window.location.href = "/join";
	}

	await updateDoc(
		doc(
			firebaseControlStore.firestore,
			`users/${
				firebaseControlStore.auth.currentUser?.uid ??
				localStorage.getItem("uid")
			}`
		),
		{
			setup: true
		}
	);

	removeEventListener("error", async (event: ErrorEvent) => {
		await deleteAccount();

		setTimeout(() => {
			window.location.href = "/join";
		}, 1500);
	});
}

export {
	signIn,
	signUp,
	Setup,
	signinWithGoogle,
	signOut,
	deleteAccount,
	changePassword,
	changeEmail,
	changeDisplayName,
	uploadPFP,
	getUserInfo
};
