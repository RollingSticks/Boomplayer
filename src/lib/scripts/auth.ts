import firebaseControlStore from "$lib/stores/firebaseControl";
import authStore from "$lib/stores/authStore";

import type { FirebaseControl, AuthStore } from "$lib/scripts/interfaces";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile /* sendEmailVerification */ } from "firebase/auth";

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
   const userInfo = await createUserWithEmailAndPassword(firebaseControl.auth, AuthStoreData.userEmail, AuthStoreData.userPassword)

   updateProfile(userInfo.user, {
      displayName: AuthStoreData.displayName,
   });

   // sendEmailVerification(userInfo.user) // TODO: add email verification
}

async function signOut() { // TODO: add error handling
   firebaseControl.auth.signOut()
}

export { signIn, signUp, signOut };