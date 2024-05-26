// ear-training-plugin/modal.ts
import { App, Notice } from 'obsidian';
import { intervalMap, semitoneIntervals, Exercise, SaveParameters} from './../utils/constants';
import { AudioUtils, Note } from './../utils/audio-utils';
import { IntervalNotePlayer } from './../models/note-players';
import BaseTrainingModal from './base-training-modal';

export default class IntervalTrainingModal extends BaseTrainingModal {
    

 	// Method to start a new practice session
    protected customReset(): void {
		(this.notePlayer as IntervalNotePlayer).updateIsAscending(this.exercise.settings.playMode === 'oam' || (this.exercise.settings.playMode === 'aad' && Math.random() < 0.5));
    }

    protected getButtonText(id:string): string {
        return intervalMap[id];
    }

    protected displayError() {
        new Notice(`The interval played was : ${intervalMap[this.playedNotes]}`);
    }

    constructor(app: App, saveParameters: SaveParameters, protected exercise: Exercise, audioUtils: AudioUtils) {
        super(app, saveParameters,'interval', exercise, new IntervalNotePlayer(audioUtils, semitoneIntervals, exercise.settings.playMode === 'chords'));
    }

}
