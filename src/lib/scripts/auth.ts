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

async function signIn() {
   if(AuthStoreData.userInfo === null) {
      AuthStoreData.userInfo = await signInWithEmailAndPassword(firebaseControl.auth, AuthStoreData.userEmail, AuthStoreData.userPassword)
      AuthStoreData.userEmail = "";
      AuthStoreData.userPassword = "";
   }

   return AuthStoreData.userInfo;
}

async function signUp() {
   if(AuthStoreData.userInfo === null) {
      AuthStoreData.userInfo = await createUserWithEmailAndPassword(firebaseControl.auth, AuthStoreData.userEmail, AuthStoreData.userPassword)
      AuthStoreData.userEmail = "";
      AuthStoreData.userPassword = "";
   }
   
   return AuthStoreData.userInfo;
}

export { signIn, signUp };