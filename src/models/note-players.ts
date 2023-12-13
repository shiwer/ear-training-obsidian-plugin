import { Note, AudioUtils } from './../utils/constants'; // Adjust the path accordingly



export class NotePlayer {
    private audioUtils: AudioUtils;
	private intervalSemitonesMap: Record<string, List<number>>;
    private isHarmonic: boolean;

	private getOrderedNotes(semitoneIntervals: List<number>, rootNote: Note): [Note] {
		const noteList:[Note] = new Array(rootNote);
		for( let i = 0; i < semitoneIntervals.length; i++ ) {
			noteList.push(this.audioUtils.getRelativeNote(rootNote, semitoneIntervals[i]))
		}
		return this.audioUtils.orderedChords(...noteList);
	}

	private getLowestNote(semitoneIntervals: List<number>, rootNote: Note): Note {
		return this.getOrderedNotes(semitoneIntervals, rootNote)[0];
	}

	private getLowestIntervalAndSemitoneShift(playedNotes: string) {
			const orderedSemitoneIntervals: List<number> = [...this.intervalSemitonesMap[playedNotes]];
        	// 0 is the potential root note
        	orderedSemitoneIntervals.push(0);
        	// we sort the note
        	orderedSemitoneIntervals.sort((a, b) => {
            	        return a - b;
            	    });

        	const lowestIntervalBetweenNotes = orderedSemitoneIntervals[1] - orderedSemitoneIntervals[0];

    		// the shift in array is always going to be negative or 0
    		const semitoneShift = -orderedSemitoneIntervals[0];

    		return {
    			lowestIntervalBetweenNotes: lowestIntervalBetweenNotes,
    			semitoneShift: semitoneShift
    		}
	}

    constructor(audioUtils: AudioUtils, intervalSemitonesMap: Record<string, List<number>>, isHarmonic: boolean) {
        this.audioUtils = audioUtils;
        this.intervalSemitonesMap = intervalSemitonesMap;
        this.isHarmonic = isHarmonic;
    }

	// when we generate a root note we need to be aware that picking a note that is too low with small intervals will make hearing really difficult
	// for now the ascending part concerning the interval will not be treated.
    generateRootNote(playedNotes: string): Note {
    	const { lowestIntervalBetweenNotes, semitoneShift } = this.getLowestIntervalAndSemitoneShift(playedNotes);

        return this.audioUtils.getRootNote(lowestIntervalBetweenNotes, semitoneShift);
    }

    getRootFromLowestNote(playedNotes:string, pitch: number) {
		const { lowestIntervalBetweenNotes, semitoneShift } = this.getLowestIntervalAndSemitoneShift(playedNotes);

		return this.audioUtils.getRootNoteFromLowestNote(lowestIntervalBetweenNotes, semitoneShift, pitch);
    }

     async playRelativeChord(playedNote: string, selectedNote: string, rootNote: Note): void {
        console.log('to be implemented. ');
     }

    async playNotes(playedNote: string, rootNote: Note): void {
        console.log('to be implemented. ');
     }

     async playFirstNote(playedNote: string, rootNote: Note): void {
	 	console.log('to be implemented. ');
	 }
}


export class IntervalNotePlayer extends NotePlayer {


    private isAscending: boolean | null = null;

    constructor(audioUtils: AudioUtils, intervalSemitonesMap: Record<string, List<number>>, isHarmonic: boolean) {
       super(audioUtils, intervalSemitonesMap, isHarmonic);
    }

    updateIsAscending(isAscending: boolean) {
        this.isAscending = isAscending;
    }

    async playRelativeChord(playedNote: string, selectedNote: string, rootNote: Note): void {
        if (selectedNote) {
            // TODO: check if it's working
            const semitoneInterval = this.intervalSemitonesMap[selectedNote][0];

            const secondNote: Note = this.audioUtils.getRelativeNote(rootNote, this.isAscending ? semitoneInterval : -semitoneInterval);
            await this.audioUtils.playNotes(this.isHarmonic, rootNote, secondNote);
        }
    }

    async playNotes(playedNote: string, rootNote: Note): void {
        if (playedNote) {
            // Display a notice with the interval
            const semitoneInterval = this.intervalSemitonesMap[playedNote][0];

            const secondNote: Note = this.audioUtils.getRelativeNote(rootNote, this.isAscending ? semitoneInterval : -semitoneInterval);
            await this.audioUtils.playNotes(this.isHarmonic, rootNote, secondNote);
        }
    }

    async playFirstNote(playedNote: string, rootNote: Note): void {
		this.audioUtils.playNote(rootNote);
	}

}

export class ChordNotePlayer extends NotePlayer {
    
    constructor(audioUtils: AudioUtils, intervalSemitonesMap: Record<string, List<number>>, isHarmonic: boolean) {
       super(audioUtils, intervalSemitonesMap, isHarmonic);
    }

	// first note played in a chord is the lowest
	async playFirstNote(playedNote: string, rootNote: Note): void {
		const lowestNote: Note = this.getLowestNote(this.intervalSemitonesMap[playedNote], rootNote);
	 	await this.audioUtils.playNote(lowestNote);
	}

    async playRelativeChord(playedNote: string, selectedNote: string, rootNote: Note): void {
        // Define the intervals based on the played and selected notes

        const lowestPlayedNote = this.getLowestNote(this.intervalSemitonesMap[playedNote], rootNote);
        const lowestSelectedNote = this.getLowestNote(this.intervalSemitonesMap[selectedNote], rootNote);

        // Calculate the relative note based on the intervals
        const semitoneInterval = this.audioUtils.calculateSemitoneInterval(lowestPlayedNote, lowestSelectedNote);

        const relativeNote = this.audioUtils.getRelativeNote(rootNote, semitoneInterval);

        const sortedChords = this.getOrderedNotes(this.intervalSemitonesMap[selectedNote], relativeNote);

        // Log or play the relative note
        // Use your audio player to play the relative note
        await this.audioUtils.playNotes(this.isHarmonic, ...sortedChords);
    }

    async playNotes(playedNote: string, rootNote: Note): void {

        if (playedNote) {
            // Display a notice with the interval
            const sortedChords = this.getOrderedNotes(this.intervalSemitonesMap[playedNote], rootNote);
            
            await this.audioUtils.playNotes(this.isHarmonic, ...sortedChords);
        }
    }

}
