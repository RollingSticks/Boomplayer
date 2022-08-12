<script lang="ts">
    import converter from "$lib/scripts/admin/converter";
    import { upload } from "$lib/scripts/admin/upload";
    import { downloadScore } from "$lib/scripts/downloadScore";
    import type { Score } from "$lib/scripts/interfaces";
    import { identifyTitle } from "$lib/scripts/scoreInfoFinder";
    import { generateUID } from "$lib/scripts/util";

    let convertResult: string;
    let uploadResult: string;
    let generatedIDResult: string;
    let downloadScoreResult: string;
    let titleDetectResult: string;

    async function convertTest() {
    	const data = await converter(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob());
    	console.log(data);
    	convertResult = JSON.stringify(data); // should be score
    }

    async function UploadTest() {
    	uploadResult = await upload(await (await fetch("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")).blob());
    	const data = await downloadScore(uploadResult);
    	console.log(data);
    	console.log(uploadResult); // should be the generated ID, regex later
    }

    async function GenerateIDTest() {
    	generatedIDResult = generateUID();
    	console.log(generatedIDResult); // should be string of length 36, regex later
    }

    async function downloadScoreTest() {
    	const data = await downloadScore("7997bb5e-d16a-444c-8b25-5406f25754f1");
    	console.log(data);
    	downloadScoreResult = JSON.stringify(data); // should be score, check validity later
    }

    async function titleDetectionTest() {
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
    	titleDetectResult = identifyTitle(score); // should be "TitleScore"
    	console.log(titleDetectResult);
    }
</script>

<ul>
    <button id="convertTest" on:click={convertTest}>converter</button>
    {#if convertResult}
        <p id="convertTestOutput">{convertResult}</p>
    {/if}

    <button id="UploadTest" on:click={UploadTest}>upload</button>
    {#if uploadResult}
        <p id="UploadTestOutput">{uploadResult}</p>
    {/if}

    <button id="GenerateIDTest" on:click={GenerateIDTest}>generate uid</button>
    {#if generatedIDResult}
        <p id="GenerateIDTestOutput">{generatedIDResult}</p>
    {/if}

    <button id="downloadScoreTest" on:click={downloadScoreTest}>download score</button>
    {#if downloadScoreResult}
        <p id="downloadScoreTestOutput">{downloadScoreResult}</p>
    {/if}
    
    <button id="titleScoreTest" on:click={titleDetectionTest}>detect score title</button>
    {#if titleDetectResult}
        <p id="titleScoreTestOutput">{titleDetectResult}</p>
    {/if}
</ul>