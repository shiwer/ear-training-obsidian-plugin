// ear-training-plugin/modal.ts
import { App, Notice } from 'obsidian';
import { chordsMap, chordsIntervals, Exercise} from './../utils/constants';
import { AudioUtils, Note } from './../utils/audio-utils';
import { ChordNotePlayer } from './../models/note-players';
import BaseTrainingModal from './base-training-modal';

export default class ChordsTrainingModal extends BaseTrainingModal { 

 	// Method to start a new practice session
    protected customReset(): void {
    }

    protected getButtonText(id:string): string {
        return chordsMap[id];
    }

    protected displayError() {
        new Notice(`The chord played was : ${chordsMap[this.playedNotes]}`);
    }


    constructor(app: App, plugin: EarTrainingPlugin, protected exercise: Exercise, audioUtils: AudioUtils, refreshCallback: () => void) {
        super(app, plugin,'chords', exercise, refreshCallback, new ChordNotePlayer(audioUtils, exercise.settings.isHarmonic));
    }

}
