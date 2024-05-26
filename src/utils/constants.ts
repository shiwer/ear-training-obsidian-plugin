// ear-training-plugin/constants.ts

export interface EarTrainingSettings {
	selectedNotes: string[],
	playMode : string,
	numExercises: number,
	tonality: string,
	mode: ExerciseMode
}

export enum ExerciseMode {
	Normal = 'Normal',
	StopOnError = "Stop on error",
	Easy = 'Easy',
}

export interface Exercise {
	exerciseId: number,
	settings: EarTrainingSettings
}

interface ListeningParameters {
	repeatTimes: number,
	delayInMs: number,
	selectedChordList: string[],
	lowestNotePitchList: number[]
}

export interface ListeningExercise extends Exercise {
	parameters: ListeningParameters
}

export interface BestScoreData {
	[exerciseNumber: number]: number;
}

export interface SaveParameters {
	autoSave: boolean,
	folderPath: string,
    filenameFormat: string
}

export interface EarTrainingGlobalSettings {
	intervals: Exercise,
	chords: Exercise,
	saveParameters: SaveParameters,
}

export const modeMap: Record<string, string> = {
	oam: 'Only ascendant',
	odm: 'Only descendant',
	aad: 'Ascendant and descendant',
	chords: 'Chords'
}

export const Exercise_Listening: ListeningExercise = {
	exerciseId: -2,
	settings: {
		selectedNotes: [
			'minor',
			'major',
			'augmented',
			'diminished',
			'minor-seventh',
			'major-seventh',
			'dominant-seventh',
			'minor-major-seventh',
			'half-diminished-seventh',
			'diminished-seventh',
			],
		playMode: 'chords',
		numExercises: 32,
		tonality: 'all',
		mode: ExerciseMode.Normal
	},
	parameters: {
		repeatTimes: 2,
		delayInMs: 4000,
		selectedChordList: [],
		lowestNotePitchList: []
	}
}


export const DEFAULT_SETTINGS: EarTrainingGlobalSettings = {
	intervals: {
		exerciseId: -1,
		settings: {
			selectedNotes: ['minor-second', 'major-second'],
			playMode: 'oam',
			numExercises: 20,
			tonality: 'C',
			mode: ExerciseMode.Normal
		}
	},
	chords: {
		exerciseId:0,
		settings: {
			selectedNotes: ['minor', 'major'],
			playMode: 'chords',
			numExercises: 20,
			tonality: 'C',
			mode: ExerciseMode.Normal
		}
	},
	saveParameters: {
		autoSave: false,
		folderPath: 'Ear Training Results',
		filenameFormat: '[Ear Training ]YYYY-MM-DD HH[h]mm[m]ss[s]'
	}


}

// Interval map with kebab case keys and English labels
export const intervalMap: Record<string, string> = {
	'minor-second': 'Minor 2nd',
	'major-second': 'Major 2nd',
	'minor-third': 'Minor 3rd',
	'major-third': 'Major 3rd',
	'perfect-fourth': 'Perfect 4th',
	'augmented-fourth': 'Augmented 4th',
	'perfect-fifth': 'Perfect 5th',
	'minor-sixth': 'Minor 6th',
	'major-sixth': 'Major 6th',
	'minor-seventh': 'Minor 7th',
	'major-seventh': 'Major 7th',
	'octave': 'Octave'
};

export const semitoneIntervals: Record<string, number[]> = {
    'minor-second': [1],
    'major-second': [2],
    'minor-third': [3],
    'major-third': [4],
    'perfect-fourth': [5],
    'augmented-fourth': [6],
    'perfect-fifth': [7],
    'minor-sixth': [8],
    'major-sixth': [9],
    'minor-seventh': [10],
    'major-seventh': [11],
    'octave': [12]
};


export const chordsMap: Record<string, string> = {
	'minor': 'Minor',
	'major': 'Major',
	'augmented': 'Augmented',
	'diminished': 'Diminished',
	'minor-seventh': 'Minor 7th',
	'major-seventh': 'Major 7th',
    'dominant-seventh': 'Dominant 7th',
	'minor-major-seventh': 'Minor major 7th',
	'half-diminished-seventh': 'Half diminished 7th',
    'diminished-seventh': 'Diminished 7th',
}

export const chordsIntervals: Record<string, number[]> = {
	'minor': [3, 7],
	'major': [4, 7],
	'augmented': [4, 8],
	'diminished': [3, 6],
	'minor-seventh': [3, 7, 10],
	'major-seventh': [4, 7, 11],
	'dominant-seventh': [4, 7, 10],
	'minor-major-seventh': [3, 7, 11],
	'half-diminished-seventh': [3, 6, 10],
	'diminished-seventh': [3, 6, 9],
}

export const triadsInversion = {
	'first-inv': [-1,-1],
	'second-inv': [0, -1],
}

export const tetradsInversion = {
	'1-3-7-5': [0,0,1,0],
	'1-5-7-3': [0,1,0,0],
	'1-5-3-7': [0,1,0,1],
	'1-7-5-3': [0,1,2,0],
	'1-7-3-5': [0,1,1,0],
}

export const triadsMap: Record<string, string> = {};
export const tetradsMap: Record<string, string> = {};

Object.keys(chordsIntervals).forEach(key => {
    const intervals = chordsIntervals[key];
    const name = chordsMap[key];
    if (intervals.length === 2) {
        triadsMap[key] = name;
    } else if (intervals.length === 3) {
        tetradsMap[key] = name;
    }
});
