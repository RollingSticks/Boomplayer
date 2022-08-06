import firebaseControlStore from "$lib/stores/firebaseControl";
import authStore from "$lib/stores/authStore";

import type { FirebaseControl, AuthStore } from "$lib/scripts/interfaces";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

let firebaseControl: FirebaseControl;

firebaseControlStore.subscribe(data => { 
	firebaseControl = data;
});

let AuthStoreData: AuthStore;

authStore.subscribe((data: AuthStore) => { 
	AuthStoreData = data;
});

async function signIn() { // TODO: add error handling
   if(!firebaseControl.auth.currentUser) signInWithEmailAndPassword(firebaseControl.auth, AuthStoreData.userEmail, AuthStoreData.userPassword)
}

async function signUp() { // TODO: add error handling
   createUserWithEmailAndPassword(firebaseControl.auth, AuthStoreData.userEmail, AuthStoreData.userPassword)
}

async function signOut() { // TODO: add error handling
   firebaseControl.auth.signOut()
}

export { signIn, signUp, signOut };