import type { AuthStore } from "$lib/scripts/interfaces";
import { writable } from "svelte/store";

export default writable<AuthStore>({
    userEmail: "" as string,
    userPassword: "" as string,
    displayName: "" as string,
});