// ear-training-plugin/modal.ts
import { App, Notice } from 'obsidian';
import { chordsMap, chordsIntervals, Exercise} from './../utils/constants';
import { AudioUtils, Note } from './../utils/audio-utils';
import BaseTrainingModal from './base-training-modal';

export default class ChordsTrainingModal extends BaseTrainingModal {
    

 	// Method to start a new practice session
    protected customReset(): void {
		console.log('in progress')
    }

    protected getButtonText(id:string): string {
        return chordsMap[id];
    }

    // Method to play the interval
    protected async playNotes(): void {
        if (this.playedNotes) {
            // Display a notice with the interval

            const semitoneIntervals:List<number> = chordsIntervals[this.playedNotes];

            const third: Note = this.audioUtils.getNextNote(this.rootNote, semitoneIntervals[0]);
            const fifth: Note = this.audioUtils.getNextNote(this.rootNote, semitoneIntervals[1]);

            const sortedChords = this.audioUtils.orderedChords(this.rootNote, third, fifth);
            await this.audioUtils.playNotes(this.exercise.settings.isHarmonic, ...sortedChords);
        }
    }

    protected displayError() {
        // to be implemented
        // new Notice(`The ${this.name} played was : ${intervalMap[this.playedNotes]}`);
        new Notice(`The chord played was : ${chordsMap[this.playedNotes]}`);
    }



    constructor(app: App, plugin: EarTrainingPlugin, protected exercise: Exercise, audioUtils: AudioUtils, refreshCallback: () => void) {
        super(app, plugin,'chords', exercise, audioUtils, refreshCallback);
    }

}
