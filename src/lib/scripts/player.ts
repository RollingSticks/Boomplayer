import { downloadScore } from "$lib/scripts/downloadScore";
import type { PlayerStore, Score } from "$lib/scripts/interfaces";
import playerControl from "$lib/stores/playerControl";

let playerControlStore: PlayerStore;

playerControl.subscribe((data) => {
	playerControlStore = data;
});

async function load(uid: string) {
	const score: Score | undefined = await downloadScore(uid);
	if (!score) {
		// dispatch error
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Het nummer kon niet worden geladen",
					retryable: true,
					scoreUid: uid
				}
			})
		);
	} else {
		playerControlStore.score = score;
		playerControlStore.playing = false;
		playerControlStore.bpm = score.bpm;
	}
}

export { load };
