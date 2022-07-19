import type { Instrument, Measure, Score } from "./interfaces";



function identifyTitle(score: Score): string {
    if (score['score-partwise'].work) {
        return score['score-partwise'].work['work-title'];
    } else if (score['score-partwise'].credit) {
        score['score-partwise'].credit.forEach(credit => {
            if (credit['credit-type'] === 'title') {
                return credit['credit-words'];
            }            
        });
    }
    return 'Untitled';
}

function getParts(score: Score): Measure[] {
    if ('measure' in score["score-partwise"].part) {
        return [score["score-partwise"].part];
    } else {
        return score["score-partwise"].part;
    }
}

function getInstruments(score: Score): Instrument[] {
    if ('midi-device' in score["score-partwise"]["part-list"]["score-part"]) {
        return [score["score-partwise"]["part-list"]["score-part"]];
    } else {
        return score["score-partwise"]["part-list"]["score-part"];
    }
}


export { identifyTitle, getParts, getInstruments }