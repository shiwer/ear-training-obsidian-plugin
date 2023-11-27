// ear-training-plugin/modal.ts
import { App, Notice } from 'obsidian';
import { intervalMap, semitoneIntervals, Exercise} from './../utils/constants';
import { AudioUtils, Note } from './../utils/audio-utils';
import BaseTrainingModal from './base-training-modal';

export default class IntervalTrainingModal extends BaseTrainingModal {
    
	private isAscending: boolean | null = null;

 	// Method to start a new practice session
    protected customReset(): void {
		this.isAscending = this.exercise.settings.mode === 'oam' || (this.exercise.settings.mode === 'aad' && Math.random() < 0.5);
    }

    protected getButtonText(id:string): string {
        return intervalMap[id];
    }

    // Method to play the interval
    protected async playNotes(): void {
        if (this.playedNotes) {
            // Display a notice with the interval
            const semitoneInterval = semitoneIntervals[this.playedNotes];

            const secondNote: Note = this.audioUtils.getNextNote(this.rootNote, this.isAscending ? semitoneInterval : -semitoneInterval);
            await this.audioUtils.playNotes(this.exercise.settings.isHarmonic, this.rootNote, secondNote);
        }
    }

    protected displayError() {
        // to be implemented
        // new Notice(`The ${this.name} played was : ${intervalMap[this.playedNotes]}`);
        new Notice(`The interval played was : ${intervalMap[this.playedNotes]}`);
    }

    constructor(app: App, plugin: EarTrainingPlugin, protected exercise: Exercise, audioUtils: AudioUtils, refreshCallback: () => void) {
        super(app, plugin,'interval', exercise, audioUtils, refreshCallback);
    }

}
