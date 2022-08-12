// @vitest-environment jsdom

import { generateUID } from '$lib/scripts/util';
import type { Score } from '$lib/scripts/interfaces';
import { identifyTitle } from '$lib/scripts/scoreInfoFinder';
import { expect, test } from 'vitest';
import converter from '$lib/scripts/admin/converter';

test('identifyTitle', () => {
	const score: Score = { "?xml": "", "score-partwise": { "defaults": { "lyric-font": "", "scaling": { "millimeters": 6.99911, "tenths": 40 }, "word-font": "", "page-layout": { "page-margins": [
		{ "left-margin": 85.7252, "top-margin": 85.7252, "bottom-margin": 85.7252, "right-margin": 85.7252 }, { "right-margin": 85.7252, "bottom-margin": 85.7252, "top-margin": 85.7252, "left-margin": 85.7252 }
	], "page-width": 1200.48, "page-height": 1696.94 } }, "identification": { "rights": "Copyright", "creator": [
		"Comp", "Lyticist"
	], "encoding": { "encoding-date": "2022-07-07", "software": "MuseScore 3.6.2", "supports": [
		"", "", "", "", ""
	] } }, "work": { "work-title": "TitleScore" }, "credit": [
		{ "credit-words": "TitleScore", "credit-type": "title" }, { "credit-words": "SubTitle", "credit-type": "subtitle" }, { "credit-words": "Comp", "credit-type": "composer" }, { "credit-type": "lyricist", "credit-words": "Lyticist" }, { "credit-type": "rights", "credit-words": "Copyright" }
	], "part": { "measure": { "barline": { "bar-style": "light-heavy" }, "print": { "system-layout": { "top-system-distance": 170, "system-margins": { "right-margin": 570.79, "left-margin": 50 } } }, "attributes": { "clef": { "sign": "G", "line": 2 }, "key": { "fifths": 0 }, "transpose": { "diatonic": 0, "chromatic": 0, "octave-change": 2 }, "time": { "beat-type": 4, "beats": 4 }, "divisions": 1 }, "note": [
		{ "duration": 1, "voice": 1, "stem": "up", "type": "quarter", "pitch": { "step": "F", "octave": 4 } }, { "stem": "up", "voice": 1, "duration": 1, "pitch": { "step": "A", "octave": 4 }, "type": "quarter" }, { "stem": "up", "pitch": { "step": "G", "octave": 4 }, "duration": 1, "voice": 1, "type": "quarter" }, { "pitch": { "octave": 4, "step": "B" }, "type": "quarter", "duration": 1, "voice": 1, "stem": "down" }
	] }, "instrument": { "part-abbreviation": "Glock.", "part-name": "Glockenspiel", "midi-device": "", "score-instrument": { "instrument-name": "Glockenspiel" }, "midi-instrument": { "volume": 78.7402, "midi-channel": 1, "pan": 0, "midi-program": 10 } } }, "part-list": { "score-part": { "part-abbreviation": "Glock.", "part-name": "Glockenspiel", "midi-device": "", "score-instrument": { "instrument-name": "Glockenspiel" }, "midi-instrument": { "volume": 78.7402, "midi-channel": 1, "pan": 0, "midi-program": 10 } } } } };
	expect(identifyTitle(score)).toBe("TitleScore");
});
test('genUID', () => {
	expect(generateUID().length).toBe(16);
});

test("convert",  async() => {
	const data = await converter(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob());
	expect(!!data).toBe(true);
});