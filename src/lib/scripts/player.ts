import { downloadScore } from "$lib/scripts/downloadScore";
import type {
	RawInstrument,
	RawMeasure,
	ScoreRaw
} from "$lib/scripts/interfaces";
import {
	identifyTitle,
	getParts,
	getInstruments
} from "$lib/scripts/scoreInfoFinder";

async function load(uid: string) {
	const score: ScoreRaw | undefined = await downloadScore(uid);
	if (!score) {
		return null;
	}
	const parts: RawMeasure[] = getParts(score);
	const instruments: RawInstrument[] = getInstruments(score);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const scoreName = identifyTitle(score);

	for (let i = 0; i < parts.length; i++) {
		parts[i].instrument = instruments[i];
	}

	return score;
}

// function play() {

// }

export { load };
