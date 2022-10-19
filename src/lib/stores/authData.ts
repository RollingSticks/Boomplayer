import type { AuthStore } from "$lib/scripts/interfaces";
import { writable } from "svelte/store";

export default writable<AuthStore>({
	displayName: "",
	userEmail: "",
	userPassword: "",
	newUserDisplayName: "",
	newUserPassword: "",
	newUserEmail: ""
});
