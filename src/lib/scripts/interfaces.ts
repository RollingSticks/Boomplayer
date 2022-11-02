import type { FirebaseApp } from "firebase/app";
import type {
	Auth,
	GoogleAuthProvider,
	ParsedToken,
	User
} from "firebase/auth";
import type { DocumentData, Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

// Raw musicXML interfaces
interface RawNote {
	duration: number;
	pitch: {
		octave: number;
		step: string;
	};
	stem: string;
	type: string;
	voice: number;
}

interface RawMeasure {
	instrument?: RawInstrument;
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
				"beats": number;
				"beat-type": number;
			};
			transpose: {
				"diatonic": number;
				"chromatic": number;
				"octave-change": number;
			};
		};
		barline: {
			"bar-style": string;
		};
		direction?: {
			"direction-type": [
				{
					metronome: {
						"beat-unit": string;
						"per-minute": number;
					};
				},
				{ words: string[] }
			];
			"sound": "";
		};
		note: RawNote[];
		print: {
			"system-layout": {
				"system-margins": {
					"left-margin": number;
					"right-margin": number;
				};
				"top-system-distance": number;
			};
		};
	};
}

interface RawInstrument {
	"midi-device": string;
	"midi-instrument": {
		"volume": number;
		"midi-channel": number;
		"pan": 0;
		"midi-program": number;
	};
	"part-abbreviation": string;
	"part-name": string;
	"score-instrument": {
		"instrument-name": string;
	};
}

interface ScoreRaw {
	"?xml": string;
	"score-partwise": {
		"credit"?: {
			"credit-type": string;
			"credit-words": string;
		}[];
		"defaults": {
			"lyric-font": string;
			"page-layout": {
				"page-height": number;
				"page-width": number;
				"page-margins": {
					"left-margin": number;
					"right-margin": number;
					"top-margin": number;
					"bottom-margin": number;
				}[];
			};
			"scaling": {
				millimeters: number;
				tenths: number;
			};
			"word-font": string;
		};
		"identification"?: {
			creator: string[];
			encoding: {
				"encoding-date": string;
				"software": string;
				"supports": string[];
			};
			rights: string;
		};
		"part": RawMeasure[] | RawMeasure;
		"part-list": {
			"score-part": RawInstrument | RawInstrument[];
		};
		"work"?: {
			"work-title": string;
		};
	};
}

interface Note {
	duration: number;
	octave: number;
	step: string;
	type: string;
}

interface Parts {
	notes: Note[];
}

interface Score {
	title: string;
	parts: Parts[];
	bpm: number;
	author: string;
	description?: string;
	color?: string;
	notes: string[];
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

interface FirebaseStore {
	app: FirebaseApp;
	firestore: Firestore;
	firebaseConfig: FirebaseConfig;
	auth: Auth;
	storage: FirebaseStorage;
	googleProvider: GoogleAuthProvider;
	setupMessaging: () => Promise<string>;
}

interface AuthStore {
	displayName: string;
	userEmail: string;
	userPassword: string;
	newUserDisplayName: string;
	newUserPassword: string;
	newUserEmail: string;
	newProfilePicture: string;
}

interface PlayerStore {
	score: Score | null;
	playing: boolean;
	bpm: number;
}

interface AppStore {
	userInfo: User | undefined;
	userData: DocumentData | undefined;
	notificationToken: string;
	isAdmin: boolean;
	currentSongUid: string;
	loadedSong: Score | undefined;
	claims: ParsedToken;
}

export type {
	ScoreRaw,
	RawMeasure,
	RawInstrument,
	PlayerStore,
	AuthStore,
	FirebaseStore,
	AppStore,
	Score,
	Parts,
	Note
};
