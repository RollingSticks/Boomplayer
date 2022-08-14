import type {
	Note,
	Parts,
	RawInstrument,
	RawMeasure,
	Score,
	ScoreRaw
} from "$lib/scripts/interfaces";

function identifyTitle(score: ScoreRaw): string {
	if (score["score-partwise"].work) {
		return score["score-partwise"].work["work-title"];
	} else if (score["score-partwise"].credit) {
		score["score-partwise"].credit.forEach((credit) => {
			if (credit["credit-type"] === "title") {
				return credit["credit-words"];
			}
		});
	}
	return "Untitled";
}

function getParts(score: ScoreRaw): RawMeasure[] {
	if ("measure" in score["score-partwise"].part) {
		return [score["score-partwise"].part];
	} else {
		return score["score-partwise"].part;
	}
}

function getInstruments(score: ScoreRaw): RawInstrument[] {
	if ("midi-device" in score["score-partwise"]["part-list"]["score-part"]) {
		return [score["score-partwise"]["part-list"]["score-part"]];
	} else {
		return score["score-partwise"]["part-list"]["score-part"];
	}
}

function getNotes(rawparts: RawMeasure[]): Parts[] {
	const parts: Parts[] = [];

	rawparts.forEach((rawPart) => {
		const notes: Note[] = [];

		rawPart.measure.note.forEach((rawNote) => {
			const note: Note = {
				duration: rawNote.duration,
				octave: rawNote.pitch.octave,
				step: rawNote.pitch.step,
				type: rawNote.type
			};
			notes.push(note);
		});

		parts.push({ notes: notes });
	});

	return parts;
}

function getBPM(rawparts: RawMeasure[]): number {
	let bpm = 100;

	rawparts.forEach((part) => {
		if (bpm !== 100) {
			const propBPM =
				part.measure.direction?.["direction-type"][0].metronome[
					"per-minute"
				];
			if (propBPM) {
				bpm = propBPM;
			}
		}
	});

	return bpm;
}

function rawToScore(score: ScoreRaw): Score {
	const rawparts = getParts(score);

	return {
		title: identifyTitle(score),
		parts: getNotes(rawparts),
		bpm: getBPM(rawparts)
	};
}

export { rawToScore, identifyTitle, getParts, getInstruments };
