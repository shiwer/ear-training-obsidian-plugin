// ear-training-plugin/constants.ts

export interface EarTrainingSettings {
	selectedNotes: string[],
	mode : string,
	numExercises: number,
	isHarmonic: boolean,
	tonality: string
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
	oam: 'Only Ascendant Mode',
	odm: 'Only Descendant Mode',
	aad: 'Ascendant And Descendant',
}

export const Exercise_Listening: ListeningExercise = {
	exerciseId: -2,
	settings: {
		selectedNotes: [
			'minor-root-based',
			'major-root-based',
			'augmented',
			'diminished',
			'minor-third-based',
			'major-third-based',
			'minor-fifth-based',
			'major-fifth-based',
			],
		mode: 'chords',
		numExercises: 32,
		isHarmonic: true,
		tonality: 'all'
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
			mode: 'oam',
			numExercises: 20,
			isHarmonic: false,
			tonality: 'C'
		}
	},
	chords: {
		exerciseId:0,
		settings: {
			selectedNotes: ['minor-root-based', 'major-root-based'],
			mode: 'chords',
			numExercises: 20,
			isHarmonic: false,
			tonality: 'C'
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
	'minor-root-based': 'Minor Chord',
	'major-root-based': 'Major Chord',
	'augmented': 'Augmented Chord',
	'diminished': 'Diminished Chord',
	'minor-fifth-based': 'Minor 2nd Inv',
	'minor-third-based': 'Minor 1st Inv',
	'major-fifth-based': 'Major 2nd Inv',
	'major-third-based': 'Major 1st Inv',
}

export const chordsIntervals: Record<string, number[]> = {
	'minor-root-based': [3, 7],
	'major-root-based': [4, 7],
	'minor-fifth-based': [3, -5],
	'minor-third-based': [-9, -5],
	'major-fifth-based': [4, -5],
	'major-third-based': [-8, -5],
	'augmented': [4, 8],
	'diminished': [3, 6],
}
