import { downloadScore } from '$lib/scripts/downloadScore';
import type { Instrument, Measure, Score } from '$lib/scripts/interfaces';
import { identifyTitle, getParts, getInstruments } from '$lib/scripts/scoreInfoFinder';

export default async function getScore(url: string): Promise<Measure[]> {
    const score: Score | undefined = await downloadScore(url);
    if (!score) {
        return [];
    }
    const parts: Measure[] = getParts(score)
    const instruments: Instrument[] = getInstruments(score);
    const scoreName = identifyTitle(score);

    for (let i = 0; i < parts.length; i++) {
        parts[i].instrument = instruments[i]
    }

    console.log(parts)

    return parts
}
