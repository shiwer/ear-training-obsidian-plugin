// ear-training-plugin/constants.ts

export interface EarTrainingSettings {
	selectedNotes: List<string>,
	mode : string,
	numExercises: number,
	isHarmonic: boolean
}

export interface BestScoreData {
	[exerciseNumber: number]: number;
}


export const DEFAULT_SETTINGS: EarTrainingSettings = {
	selectedNotes: ['minor-second', 'major-second'],
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


export const chordsMap: Record<string, string> = {
	'minor-root-based': 'Minor Chord',
	'major-root-based': 'Major Chord',
	'minor-fifth-based': 'Xm/5th',
	'minor-third-based': 'Xm/3rd',
	'major-fifth-based': 'X/5th',
	'major-third-based': 'X/3rd',
}

export const chordsIntervals: Record<string, List<number>> = {
	'minor-root-based': [3, 7],
	'major-root-based': [4, 7],
	'minor-fifth-based': [3, -5],
	'minor-third-based': [-9, -5],
	'major-fifth-based': [4, -5],
	'major-third-based': [-8, -5],
}


export interface Exercise {
	exerciseId: number,
	settings: EarTrainingSettings
}


const Exercise_1_1: Exercise = {
	exerciseId: 1,
	settings: {
		selectedNotes: ['minor-third', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_1_2: EarTrainingSettings = {
	exerciseId: 2,
	settings: {
		selectedNotes: ['major-third', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false	
	}
}

const Exercise_1_3: EarTrainingSettings = {
	exerciseId: 3,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_1_4: EarTrainingSettings = {
	exerciseId: 4,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'octave'],
		mode: 'aad',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_2_1: Exercise = {
	exerciseId: 5,
	settings: {
		selectedNotes: ['perfect-fourth', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_2_2: EarTrainingSettings = {
	exerciseId: 6,
	settings: {
		selectedNotes: ['perfect-fifth', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false	
	}
}

const Exercise_2_3: EarTrainingSettings = {
	exerciseId: 7,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'perfect-fourth', 'perfect-fifth', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_2_4: EarTrainingSettings = {
	exerciseId: 8,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'perfect-fourth', 'perfect-fifth', 'octave'],
		mode: 'aad',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_3_1: EarTrainingSettings = {
	exerciseId: 9,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_3_2: EarTrainingSettings = {
	exerciseId: 10,
	settings: {
		selectedNotes: ['perfect-fourth', 'perfect-fifth'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_3_3: EarTrainingSettings = {
	exerciseId: 11,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'perfect-fourth'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_3_4: EarTrainingSettings = {
	exerciseId: 12,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'perfect-fourth', 'perfect-fifth'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_3_5: EarTrainingSettings = {
	exerciseId: 13,
	settings: {
		selectedNotes: ['perfect-fourth', 'perfect-fifth', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_3_6: EarTrainingSettings = {
	exerciseId: 14,
	settings: {
		selectedNotes: ['minor-third', 'major-third', 'perfect-fourth', 'perfect-fifth', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_4_1: EarTrainingSettings = {
	exerciseId: 15,
	settings: {
		selectedNotes: ['minor-root-based', 'major-root-based'],
		mode: 'chords',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_4_2: EarTrainingSettings = {
	exerciseId: 16,
	settings: {
		selectedNotes: [
			'minor-root-based',
			'major-third-based',
			'major-root-based',
			'minor-third-based',
			'minor-fifth-based',
			'major-fifth-based',
            			],
		mode: 'chords',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_4_3: EarTrainingSettings = {
	exerciseId: 17,
	settings: {
		selectedNotes: [
			'minor-root-based',
			'major-third-based',
			'major-root-based',
			'minor-third-based',
			'minor-fifth-based',
			'major-fifth-based',
			],
		mode: 'chords',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_5_1: EarTrainingSettings = {
	exerciseId: 18,
	settings: {
		selectedNotes: ['minor-second', 'major-second'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_5_2: EarTrainingSettings = {
	exerciseId: 19,
	settings: {
		selectedNotes: ['minor-second', 'major-second', 'minor-third', 'major-third'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_5_3: EarTrainingSettings = {
	exerciseId: 20,
	settings: {
		selectedNotes: ['perfect-fourth', 'augmented-fourth', 'perfect-fifth'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}

const Exercise_5_4: EarTrainingSettings = {
	exerciseId: 21,
	settings: {
		selectedNotes: ['minor-second', 'major-second', 'minor-third', 'major-third', 'perfect-fourth', 'augmented-fourth', 'perfect-fifth', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: false
	}
}


const Exercise_6_1: EarTrainingSettings = {
	exerciseId: 22,
	settings: {
		selectedNotes: ['minor-second', 'major-second'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_6_2: EarTrainingSettings = {
	exerciseId: 23,
	settings: {
		selectedNotes: ['minor-second', 'major-second', 'minor-third', 'major-third'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_6_3: EarTrainingSettings = {
	exerciseId: 24,
	settings: {
		selectedNotes: ['perfect-fourth', 'augmented-fourth', 'perfect-fifth'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

const Exercise_6_4: EarTrainingSettings = {
	exerciseId: 25,
	settings: {
		selectedNotes: ['minor-second', 'major-second', 'minor-third', 'major-third', 'perfect-fourth', 'augmented-fourth', 'perfect-fifth', 'octave'],
		mode: 'oam',
		numExercises: 32,
		isHarmonic: true
	}
}

export const chapterTitles: Record<number, string> = {
	1: "Major, Minor Thirds and Octave (melodic)",
	2: "Perfect Fourth and Fifth (melodic)",
	3: "Major, Minor Thirds, Perfect Fourth and Fifth and Octave (harmonic)",
	4: "Major and Minor Chords",
	5: "Major, Minor Seconds and Augmented Fourth (melodic)",
	6: "Major, Minor Seconds and Augmented Fourth (harmonic)"
};


export const chapterExercises: Record<number, string> = {
	1: [Exercise_1_1, Exercise_1_2, Exercise_1_3, Exercise_1_4],
	2: [Exercise_2_1, Exercise_2_2, Exercise_2_3, Exercise_2_4],
	3: [Exercise_3_1, Exercise_3_2, Exercise_3_3, Exercise_3_4, Exercise_3_5, Exercise_3_6],
	4: [Exercise_4_1, Exercise_4_2, Exercise_4_3],
	5: [Exercise_5_1, Exercise_5_2, Exercise_5_3, Exercise_5_4],
	6: [Exercise_6_1, Exercise_6_2, Exercise_6_3, Exercise_6_4]
}


