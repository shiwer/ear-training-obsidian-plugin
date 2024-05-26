// ear-training-plugin/menu-modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { AudioUtils } from './../utils/audio-utils';
import { ChordNotePlayer } from './../models/note-players';
import { chordsIntervals, Exercise_Listening } from './../utils/constants';
import EarTrainingPlugin from './../main'
import IntervalTrainingModal from './intervals-training-modal';
import ChordsTrainingModal from './chords-training-modal';
import ListenOnRepeatModal from './listen-on-repeat-modal';
import ChordsSettingsModal from './chords-settings-modal';
import IntervalsSettingsModal from './intervals-settings-modal';


export default class MenuModal extends Modal {
    private freeIntervalPracticeButton: Setting;
    private freeChordsPracticeButton: Setting;

    constructor(app: App, private plugin: EarTrainingPlugin, private audioUtils: AudioUtils) {
        super(app);
    }

    // ear-training-plugin/menu-modal.ts

    private allowFreePractice(): void {
        const { contentEl } = this;

        if (this.plugin.settings.intervals.settings.selectedNotes.length < 2) {
            this.freeIntervalPracticeButton.components[0].disabled = true;
            this.freeIntervalPracticeButton.setDesc('Please select at least 2 intervals.');
            return;
        }

        if(this.plugin.settings.chords.settings.selectedNotes.length < 2) {
	 		this.freeChordsPracticeButton.components[0].disabled = true;
			this.freeChordsPracticeButton.setDesc('Please select at least 2 chords.');
        }

        // Remove the disabled class if the conditions are met
        this.freeIntervalPracticeButton.controlEl.removeClass('disabled');
        this.freeIntervalPracticeButton.setDesc('');
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('ear-plugin-modal');

        contentEl.createEl('h2', { text: 'Menu' });

        contentEl.createEl('h3', { text: 'Interval' });

		new Setting(contentEl)
			.setName('Interval settings')
			.setDesc('Change intervals that needs to be played in the free interval training.')
			.addButton(button => {
				button
					.setButtonText('Options')
					.onClick((evt) => {
						// prevent relauch training modal at the end of the training
						if (evt instanceof PointerEvent && evt.pointerType === '') {
							// Do nothing if the Enter key is pressed
							return;
						}
						new IntervalsSettingsModal(this.app, this.plugin).open();
					});
			});

        // Display a button to start the free interval practice
        this.freeIntervalPracticeButton = new Setting(contentEl)
            .setName('Free interval training')
            .setDesc('Practice intervals freely')
            .addButton(button => {
                button
                    .setButtonText('Start free interval training')
                    .onClick((evt) => {
                       // prevent relauch training modal at the end of the training
                       if (evt instanceof PointerEvent && evt.pointerType === '') {
							// Do nothing if the Enter key is pressed
							return;
						}
                        new IntervalTrainingModal(this.app, this.plugin.settings.saveParameters, this.plugin.settings.intervals, this.audioUtils).open();
                    });
            });
            

        contentEl.createEl('h3', { text: 'Chords' });

		new Setting(contentEl)
			.setName('Chords settings')
			.setDesc('Change chords that needs to be played in the free chord training.')
			.addButton(button => {
				button
					.setButtonText('Options')
					.onClick((evt) => {
						// prevent relauch training modal at the end of the training
						if (evt instanceof PointerEvent && evt.pointerType === '') {
							// Do nothing if the Enter key is pressed
							return;
						}
						new ChordsSettingsModal(this.app, this.plugin).open();
					});
			});

		this.freeChordsPracticeButton = new Setting(contentEl)
			.setName('Free chords training')
			.setDesc('Practice chords freely')
			.addButton(button => {
				button
					.setButtonText('Start free chords training')
					.onClick((evt) => {
						// prevent relauch training modal at the end of the training
						if (evt instanceof PointerEvent && evt.pointerType === '') {
							// Do nothing if the Enter key is pressed
							return;
						}
						new ChordsTrainingModal(this.app, this.plugin.settings.saveParameters, this.plugin.settings.chords, this.audioUtils).open();
					});
			});

		new Setting(contentEl)
			.setName('Listen on repeat')
			.setDesc('Ear chords playing on repeat for passive practice.')
			.addButton(button => {
				button
					.setButtonText('Start listening chords training')
					.onClick((evt) => {
						// prevent relauch training modal at the end of the training
						if (evt instanceof PointerEvent && evt.pointerType === '') {
							// Do nothing if the Enter key is pressed
							return;
						}
						new ListenOnRepeatModal(this.app, Exercise_Listening,  new ChordNotePlayer(this.audioUtils, chordsIntervals, this.plugin.settings.chords.settings.playMode === 'chords')).open();
					});
			});

        // Check if free interval practice is allowed
        this.allowFreePractice();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
