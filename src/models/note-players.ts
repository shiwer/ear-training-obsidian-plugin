import { Note, AudioUtils } from './../utils/constants'; // Adjust the path accordingly
import { semitoneIntervals, chordsIntervals } from './../utils/constants';



export class NotePlayer {
    private audioUtils: AudioUtils;

    private isHarmonic: boolean;

    private rootNote: Note;
    private playedNotes: string;


    constructor(audioUtils: AudioUtils, isHarmonic: boolean) {
        this.audioUtils = audioUtils;
        this.isHarmonic = isHarmonic;
    }

    setPlayedNotes(playedNotes: string): void {
        this.playedNotes = playedNotes;
    }

    getPlayedNotes(): string {
        return this.playedNotes;
    }

    updateRootNote(): void {
        this.rootNote = this.audioUtils.getRootNote();
    }

    setRootNote(rootNote: Note): void {
        this.rootNote = rootNote;
    }

    getRootNote(): Note {
        return this.rootNote;
    }

     async playNotes(): void {
        console.log('to be implemented. ')
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

    async playNotes(): void {
        if (this.playedNotes) {
            // Display a notice with the interval
            const semitoneInterval = semitoneIntervals[this.playedNotes];

            const secondNote: Note = this.audioUtils.getNextNote(this.rootNote, this.isAscending ? semitoneInterval : -semitoneInterval);
            await this.audioUtils.playNotes(this.isHarmonic, this.rootNote, secondNote);
        }
    }

}

export class ChordNotePlayer extends NotePlayer {
    
    constructor(audioUtils: AudioUtils, isHarmonic: boolean) {
       super(audioUtils, isHarmonic);
    }


    async playNotes(): void {
        if (this.playedNotes) {
            // Display a notice with the interval

            const semitoneIntervals:List<number> = chordsIntervals[this.playedNotes];

            const third: Note = this.audioUtils.getNextNote(this.rootNote, semitoneIntervals[0]);
            const fifth: Note = this.audioUtils.getNextNote(this.rootNote, semitoneIntervals[1]);

            const sortedChords = this.audioUtils.orderedChords(this.rootNote, third, fifth);
            await this.audioUtils.playNotes(this.isHarmonic, ...sortedChords);
        }
    }
}