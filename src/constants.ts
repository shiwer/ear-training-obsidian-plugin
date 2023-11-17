// ear-training-plugin/constants.ts

export interface EarTrainingSettings {
	selectedIntervals: List<string>,
	mode : string,
	numExercises: number
}

export const DEFAULT_SETTINGS: EarTrainingSettings = {
	selectedIntervals: ['minor-second'],
	mode: 'oam',
	numExercises: 10
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
};