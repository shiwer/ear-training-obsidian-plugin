// ear-training-plugin/modal.ts
import { App, Notice } from 'obsidian';
import { intervalMap, semitoneIntervals, Exercise} from './../utils/constants';
import { AudioUtils, Note } from './../utils/audio-utils';
import { IntervalNotePlayer } from './../models/note-players';
import BaseTrainingModal from './base-training-modal';

export default class IntervalTrainingModal extends BaseTrainingModal {
    

 	// Method to start a new practice session
    protected customReset(): void {
		this.notePlayer.updateIsAscending(this.exercise.settings.mode === 'oam' || (this.exercise.settings.mode === 'aad' && Math.random() < 0.5));
    }

    protected getButtonText(id:string): string {
        return intervalMap[id];
    }

    protected displayError() {
        new Notice(`The interval played was : ${intervalMap[this.playedNotes]}`);
    }

    constructor(app: App, plugin: EarTrainingPlugin, protected exercise: Exercise, audioUtils: AudioUtils, refreshCallback: () => void) {
        super(app, plugin,'interval', exercise, refreshCallback, new IntervalNotePlayer(audioUtils, exercise.settings.isHarmonic));
    }

}
