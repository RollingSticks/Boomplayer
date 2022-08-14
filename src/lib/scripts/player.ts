import { downloadScore } from "$lib/scripts/downloadScore";
import type { Score } from "$lib/scripts/interfaces";

async function load(uid: string) {
	const score: Score | undefined = await downloadScore(uid);
	if (!score) {
		// dispatch error
	}

	// save score to store
	return score;
}

export { load };
