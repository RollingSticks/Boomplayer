import type { PlayerStore, Score } from "$lib/scripts/interfaces";
import { writable } from "svelte/store";

export default writable<PlayerStore>({
	score: null,
	playing: false,
	bpm: 100
});
