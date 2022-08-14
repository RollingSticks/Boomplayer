import type { PlayerStore } from "$lib/scripts/interfaces";
import { writable } from "svelte/store";

export default writable<PlayerStore>({
	playing: false,
	bpm: 100
});
