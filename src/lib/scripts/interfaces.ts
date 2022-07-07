
interface Note {

}

interface Measure {
    attributes: {
        clef: {
            sign: string;
            line: number;
        };
        divisions: number;
        key: {
            fifths: number;
        };
        time: {
            beats: number;
            "beat-type": number;
        };
        transpose: {
            diatonic: number;
            chromatic: number;
            "octave-change": number;
        };
    };
    barline: {
        "bar-style": string;
    };
    note: Array<Note>;
    print: {
        "system-layout": {
            "system-margins": {
                "left-margin": number;
                "right-margin": number;
            };
            "top-system-distance": number;
        }
    };
}

interface Score {
	"?xml": string;
	"score-partwise": {
		credit?: Array<{
			"credit-type": string;
			"credit-words": string;
		}>;
		defaults: {
			"lyric-font": string;
			"page-layout": {
				"page-height": number;
				"page-width": number;
				"page-margins": Array<{
					"left-margin": number;
					"right-margin": number;
					"top-margin": number;
				}>
			};
			scaling: {
				millimeters: number;
				tenths: number;
			};
			"word-font": string;
		};
        identification?: {
            creator: Array<string>;
            encoding: {
                "encoding-date": string;
                software: string;
                supports: Array<string>;
            };
            rights: string;
        };
        parts: {
            measure: Measure
        } | Array<Measure>;
        "part-list": {
            "score-part": {
                "midi-device": string;
                "midi-instrument": string;
                "part-abbreviation": string;
                "part-name": string;
                "score-instrument": {
                    "instrument-name": string;
                }
            }
        },
        work: {
            "work-title": string;
        }
	}
}

export type { Score };