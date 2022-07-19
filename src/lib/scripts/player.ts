import donwloadScore from './downloadScore';
import type { Instrument, Measure, Score } from './interfaces';

export default async function getScore(url: string): Promise<Measure[]> {
    const score: Score = await donwloadScore(url);
    const parts: Measure[] = score["score-partwise"].part.measure ? [score["score-partwise"].part] : score["score-partwise"].part // it works, trust me
    const instruments: Instrument[] = score["score-partwise"]['part-list']['score-part'][0] ? score["score-partwise"]['part-list']['score-part'] : [score["score-partwise"]['part-list']['score-part']] // it works, trust me
    const scoreName = score['score-partwise'].work ? score['score-partwise'].work['work-title'] : 'Untitled';
    
    
    
    
    
    
    console.log(score)

    for (let i = 0; i < parts.length; i++) {
        parts[i].instrument = instruments[i]
    }

    return parts
}