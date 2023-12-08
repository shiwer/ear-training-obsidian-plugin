// ear-training-plugin/menu-modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { AudioUtils } from './../utils/audio-utils';
import { chapterTitles } from './../utils/constants';
import IntervalTrainingModal from './interval-training-modal';
import ChordsTrainingModal from './chords-training-modal';
import ChapterModal from './chapter-modal';


export default class MenuModal extends Modal {
    private freeIntervalPracticeButton: HTMLButtonElement | null = null;
    private freeChordsPracticeButton: HTMLButtonElement | null = null;
    private audioUtils: AudioUtils;
    plugin: EarTrainingPlugin;

    constructor(app: App, plugin: EarTrainingPlugin, audioUtils: AudioUtils) {
        super(app, plugin);
        this.plugin = plugin;
        this.audioUtils = audioUtils;
    }

    // ear-training-plugin/menu-modal.ts

    private allowFreePractice(): void {
        const { contentEl } = this;

        // Check if the selected intervals meet the requirement based on the mode
        if (
            (this.plugin.settings.intervals.settings.mode === 'oam' || this.plugin.settings.intervals.settings.mode === 'odm') &&
            this.plugin.settings.intervals.settings.selectedNotes.length < 2
        ) {
            this.freeIntervalPracticeButton.components[0].disabled = true;
            this.freeIntervalPracticeButton.setDesc('Please select at least 2 intervals for OAM or ODM mode.');
            return;
        } else if (this.plugin.settings.intervals.settings.selectedNotes.length < 1) {
            this.freeIntervalPracticeButton.components[0].disabled = true;
            this.freeIntervalPracticeButton.setDesc('Please select at least 1 interval.');
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

    private nothing(): void {

    }


    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('ear-plugin-modal');

        contentEl.createEl('h2', { text: 'Exercises Menu' });

        contentEl.createEl('h3', { text: 'Free practices' });

        // Display a button to start the free interval practice
        this.freeIntervalPracticeButton = new Setting(contentEl)
            .setName('Free Interval Training')
            .setDesc('Practice intervals freely')
            .addButton(button => {
                button
                    .setButtonText('Start Free Interval Training')
                    .onClick(() => {
                        // Open the Free Interval Training modal
                        console.log(this.plugin.settings);
                        new IntervalTrainingModal(this.app, this.plugin, this.plugin.settings.intervals, this.audioUtils, this.nothing.bind(this)).open();
                    });
            });
            
		this.freeChordsPracticeButton = new Setting(contentEl)
			.setName('Free Chords Training')
			.setDesc('Practice chords freely')
			.addButton(button => {
				button
					.setButtonText('Start Free Chords Training')
					.onClick(() => {
						// Open the Free Interval Training modal
						new ChordsTrainingModal(this.app, this.plugin, this.plugin.settings.chords, this.audioUtils, this.nothing.bind(this)).open();
					});
			});

        contentEl.createEl('h3', { text: 'Chapters' });

        for (const key in chapterTitles) {
            if (Object.prototype.hasOwnProperty.call(chapterTitles, key)) {
                new Setting(contentEl)
                .setName(`Chapter ${key}`)
                .setDesc(chapterTitles[key])
                .addButton(button => {
                    button
                        .setButtonText('Go')
                        .onClick(() => {
                            new ChapterModal(this.app, this.plugin, this.audioUtils, key).open();
                            this.close();
                        });
                });
            }
        }
        // Check if free interval practice is allowed
        this.allowFreePractice();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
