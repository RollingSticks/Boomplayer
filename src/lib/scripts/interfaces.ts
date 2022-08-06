import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

interface Note {
    duration: number;
    pitch: {
        ocatave: number;
        step: string;
    }
    stem: string;
    type: string;
    voice: number;
}

interface Measure {
    instrument?: Instrument;
    measure: {
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
        note: Note[];
        print: {
            "system-layout": {
                "system-margins": {
                    "left-margin": number;
                    "right-margin": number;
                };
                "top-system-distance": number;
            }
        };
    };
}

interface Instrument {
    "midi-device": string;
    "midi-instrument": string;
    "part-abbreviation": string;
    "part-name": string;
    "score-instrument": {
        "instrument-name": string;
    }
}

interface Score {
	"?xml": string;
	"score-partwise": {
		credit?: {
			"credit-type": string;
			"credit-words": string;
		}[];
		defaults: {
			"lyric-font": string;
			"page-layout": {
				"page-height": number;
				"page-width": number;
				"page-margins": {
					"left-margin": number;
					"right-margin": number;
					"top-margin": number;
				}[]
			};
			scaling: {
				millimeters: number;
				tenths: number;
			};
			"word-font": string;
		};
        identification?: {
            creator: string[];
            encoding: {
                "encoding-date": string;
                software: string;
                supports: string[];
            };
            rights: string;
        };
        part: Measure[] | Measure;
        "part-list": {
            "score-part": Instrument | Instrument[];
        },
        work?: {
            "work-title": string;
        },
    },
}

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

interface FirebaseControl {
	app: FirebaseApp,
	firestore: Firestore,
	firebaseConfig: FirebaseConfig,
    auth: Auth,
}

interface AuthStore {
    userEmail: string;
    userPassword: string;
}

export type { AuthStore, Score, FirebaseControl, Measure, Instrument };