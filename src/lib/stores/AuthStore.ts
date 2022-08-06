import type { AuthStore } from "$lib/scripts/interfaces";
import type { UserCredential } from "firebase/auth";
import { writable } from "svelte/store";

export default writable<AuthStore>({
    userEmail: "" as string,
    userPassword: "" as string,
    userInfo: null as UserCredential | null,
});