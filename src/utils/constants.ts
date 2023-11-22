// ear-training-plugin/constants.ts

export interface EarTrainingSettings {
	selectedIntervals: List<string>,
	mode : string,
	numExercises: number,
	isHarmonic: boolean
}

export interface BestScoreData {
	[exerciseNumber: number]: number;
}


export const DEFAULT_SETTINGS: EarTrainingSettings = {
	selectedIntervals: ['minor-second', 'major-second'],
	mode: 'oam',
	numExercises: 10,
	isHarmonic: false
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

export const semitoneIntervals: Record<string, number> = {
    'minor-second': 1,
    'major-second': 2,
    'minor-third': 3,
    'major-third': 4,
    'perfect-fourth': 5,
    'augmented-fourth': 6,
    'perfect-fifth': 7,
    'minor-sixth': 8,
    'major-sixth': 9,
    'minor-seventh': 10,
    'major-seventh': 11,
    'octave': 12
};


export interface Exercise {
	exerciseId: number,
	settings: EarTrainingSettings
}


const Exercise_1_1: Exercise = {
	exerciseId: 1,
	settings: {
		selectedIntervals: ['minor-third', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_1_2: EarTrainingSettings = {
	exerciseId: 2,
	settings: {
		selectedIntervals: ['major-third', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false	
	}
}

const Exercise_1_3: EarTrainingSettings = {
	exerciseId: 3,
	settings: {
		selectedIntervals: ['minor-third', 'major-third', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_1_4: EarTrainingSettings = {
	exerciseId: 4,
	settings: {
		selectedIntervals: ['minor-third', 'major-third', 'octave'],
		mode: 'aad',
		numExercises: 32,
		isHarmonic: false
	}
}

export const chapterExercises: Record<number, string> = {
	1: [Exercise_1_1, Exercise_1_2, Exercise_1_3, Exercise_1_4]
}

export const chapterTitles: Record<number, string> = {
	1: "Major, Minor Thirds and Octave (mélodique)"
};



