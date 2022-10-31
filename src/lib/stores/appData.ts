import type { AppStore, Score } from "$lib/scripts/interfaces";
import { writable } from "svelte/store";

export default writable<AppStore>({
	userInfo: undefined,
	userData: undefined,
	isAdmin: false,
	currentSongUid: "",
	loadedSong: {} as Score
});
