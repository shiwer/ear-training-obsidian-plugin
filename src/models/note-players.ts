import { Note, AudioUtils } from './../utils/constants'; // Adjust the path accordingly
import { semitoneIntervals, chordsIntervals } from './../utils/constants';



export class NotePlayer {
    private audioUtils: AudioUtils;

    private isHarmonic: boolean;

    constructor(audioUtils: AudioUtils, isHarmonic: boolean) {
        this.audioUtils = audioUtils;
        this.isHarmonic = isHarmonic;
    }

    generateRootNote(): Note {
        return this.audioUtils.getRootNote();
    }

     async playRelativeChord(playedNote: string, selectedNote: string, rootNote: Note): void {
        console.log('to be implemented. ');
     }

    async playNotes(playedNote: string, rootNote: Note): void {
        console.log('to be implemented. ');
     }
}


export class IntervalNotePlayer extends NotePlayer {


    private isAscending: boolean | null = null;

    constructor(audioUtils: AudioUtils, isHarmonic: boolean) {
       super(audioUtils, isHarmonic);
    }

    updateIsAscending(isAscending: boolean) {
        this.isAscending = isAscending;
    }

    async playRelativeChord(playedNote: string, selectedNote: string, rootNote: Note): void {
        if (selectedNote) {
            // Display a notice with the interval
            const semitoneInterval = semitoneIntervals[selectedNote];

            const secondNote: Note = this.audioUtils.getRelativeNote(rootNote, this.isAscending ? semitoneInterval : -semitoneInterval);
            await this.audioUtils.playNotes(this.isHarmonic, rootNote, secondNote);
        }
    }

    async playNotes(playedNote: string, rootNote: Note): void {
        if (playedNote) {
            // Display a notice with the interval
            const semitoneInterval = semitoneIntervals[playedNote];

            const secondNote: Note = this.audioUtils.getRelativeNote(rootNote, this.isAscending ? semitoneInterval : -semitoneInterval);
            await this.audioUtils.playNotes(this.isHarmonic, rootNote, secondNote);
        }
    }

}

export class ChordNotePlayer extends NotePlayer {

    private getOrderedNotes(semitoneIntervals: List<number>, rootNote: Note): [Note] {
        const third: Note = this.audioUtils.getRelativeNote(rootNote, semitoneIntervals[0]);
        const fifth: Note = this.audioUtils.getRelativeNote(rootNote, semitoneIntervals[1]);

        return this.audioUtils.orderedChords(rootNote, third, fifth);
    }

    private getLowestNote(semitoneIntervals: List<number>, rootNote: Note): Note {
        return this.getOrderedNotes(semitoneIntervals, rootNote)[0];
    }
    
    constructor(audioUtils: AudioUtils, isHarmonic: boolean) {
       super(audioUtils, isHarmonic);
    }

    async playRelativeChord(playedNote: string, selectedNote: string, rootNote: Note): void {
        // Define the intervals based on the played and selected notes

        const lowestPlayedNote = this.getLowestNote(chordsIntervals[playedNote], rootNote);
        const lowestSelectedNote = this.getLowestNote(chordsIntervals[selectedNote], rootNote);

        // Calculate the relative note based on the intervals
        const semitoneInterval = this.audioUtils.calculateSemitoneInterval(lowestPlayedNote, lowestSelectedNote);

        const relativeNote = this.audioUtils.getRelativeNote(rootNote, semitoneInterval);

        const sortedChords = this.getOrderedNotes(chordsIntervals[selectedNote], relativeNote);

        // Log or play the relative note
        // Use your audio player to play the relative note
        await this.audioUtils.playNotes(this.isHarmonic, ...sortedChords);
    }

    async playNotes(playedNote: string, rootNote: Note): void {

        if (playedNote) {
            // Display a notice with the interval
            const sortedChords = this.getOrderedNotes(chordsIntervals[playedNote], rootNote);
            
            await this.audioUtils.playNotes(this.isHarmonic, ...sortedChords);
        }
    }

}