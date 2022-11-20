import { downloadScore } from "$lib/scripts/downloadScore";
import type { PlayerStore, Score, Parts, Note } from "$lib/scripts/interfaces";
import playerControl from "$lib/stores/playerControl";
import Ball from "$lib/components/Ball.svelte";

let playerControlStore: PlayerStore;

playerControl.subscribe((data) => {
	playerControlStore = data;
});

let paused = false;

const noteColor: { [key: string]: string } = {
	C: "ff0000",
	D: "ffc000",
	E: "ffff00",
	F: "66ff33",
	G: "339966",
	A: "00afef",
	B: "ff00ff"
};

async function spawnNote(note: Note) {
	const wait = (60000 / playerControlStore.bpm) * note.duration;
	return new Promise<void>((resolve) => {
		if (!note.rest) {
			new Ball({
				target: document.getElementById(noteColor[note.step]),
				props: {
					noteColor: noteColor[note.step],
					fallTime: 60 / playerControlStore.bpm * note.duration,
					sound: note.step
				},
			});
		}
		setTimeout(() => {
			resolve();
		}, wait);
	});
}

async function unpause() {
	return new Promise<void>((resolve) => {
		setInterval(() => {
			if (!paused) {
				resolve();
			}
		}, 25);
	});
}

async function partPlayer(part: Parts) {
	for (const note of part.notes) {
		await unpause();
		await spawnNote(note);
		await unpause();
	}
	console.log("Part finished");
	reset();
}

function play() {
	if (!paused) {
		console.log("Playing");
		if (playerControlStore.score !== null) {
			playerControlStore.playing = true;

			playerControlStore.score?.parts.forEach((part) => {
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
	} else {
		console.log("Unpausing");
		for (const ball of document.getElementsByClassName("ball")) {
			ball.getAnimations().forEach((animation) => {
				animation.play();
			});
		}

		paused = false;

		playerControlStore.playing = true;
	}
}

async function load(uid: string) {
	const score: Score | undefined = await downloadScore(uid);
	playerControlStore.score = score;
	reset();
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
	}
}

async function pause() {
	console.log("Pausing");
	dispatchEvent(new CustomEvent("pause"));
	playerControlStore.playing = false;
	paused = true;

	for (const ball of document.getElementsByClassName("ball")) {
		ball.getAnimations().forEach((animation) => {
			animation.pause();
		});
	}
}

async function reset() {
	console.log("reset");
	playerControlStore.playing = false;
	paused = false;
}

export { load, play, pause, reset };
