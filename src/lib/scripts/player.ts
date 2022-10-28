import { downloadScore } from "$lib/scripts/downloadScore";
import type { PlayerStore, Score, Parts } from "$lib/scripts/interfaces";
import playerControl from "$lib/stores/playerControl";

let playerControlStore: PlayerStore;

playerControl.subscribe((data) => {
	playerControlStore = data;
});

async function partPlayer(part: Parts) {
	const notes = part.notes;

	let time = 0.1;

	for (const note of notes) {
		const wait = (60000 / playerControlStore.bpm) * note.duration + time;
		time = wait;
		setTimeout(() => {
			console.log(
				`Summon ${note.step}${note.octave} of size ${note.duration} and type ${note.type}`
			);
		}, wait);
	}
}

function play() {
	if (playerControlStore.score !== null) {
		console.log(playerControlStore.score);
		playerControlStore.playing = true;

		playerControlStore.score.parts.forEach((part) => {
			partPlayer(part);
		});
	} else {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Er is geen nummer geladen",
					retriable: false,
					playerControlStore: playerControlStore
				}
			})
		);
	}
}

async function load(uid: string) {
	const score: Score | undefined = await downloadScore(uid);
	if (!score) {
		// dispatch error
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Het nummer kon niet worden geladen",
					retriable: true,
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

export { load, play };
