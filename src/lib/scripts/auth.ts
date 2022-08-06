import firebaseControlStore from "$lib/stores/firebaseControl";
import authStore from "$lib/stores/AuthStore";

import type { FirebaseControl, AuthStore } from "$lib/scripts/interfaces";
import { signInWithEmailAndPassword } from "firebase/auth";

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

export { signIn };