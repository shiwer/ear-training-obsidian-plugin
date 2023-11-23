// ear-training-plugin/menu-modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { AudioUtils } from './../utils/audio-utils';
import { AudioPlayer } from './../utils/audio';
import { chapterTitles } from './../utils/constants';
import IntervalTrainingModal from './interval-training-modal';
import ChapterModal from './chapter-modal';


export default class MenuModal extends Modal {
    private freePracticeButton: HTMLButtonElement | null = null;
    private audioUtils: AudioUtils;
    plugin: EarTrainingPlugin;

    constructor(app: App, plugin: EarTrainingPlugin) {
        super(app, plugin);
        this.plugin = plugin;
        const baseDir = app.vault.adapter.getBasePath();
        const pluginDir = baseDir + '/.obsidian/plugins/ear-training-plugin/public';
        this.audioUtils = new AudioUtils(new AudioPlayer(pluginDir))
    }

    // ear-training-plugin/menu-modal.ts

    private allowFreePractice(): void {
        const { contentEl } = this;

        // Check if the selected intervals meet the requirement based on the mode
        if (
            (this.plugin.settings.mode === 'oam' || this.plugin.settings.mode === 'odm') &&
            this.plugin.settings.selectedNotes.length < 2
        ) {
            this.freePracticeButton.components[0].disabled = true;
            this.freePracticeButton.setDesc('Please select at least 2 intervals for OAM or ODM mode.');
            return;
        } else if (this.plugin.settings.selectedNotes.length < 1) {
            this.freePracticeButton.components[0].disabled = true;
            this.freePracticeButton.setDesc('Please select at least 1 interval.');
            return;
        }

        // Remove the disabled class if the conditions are met
        this.freePracticeButton.controlEl.removeClass('disabled');
        this.freePracticeButton.setDesc('');
    }


    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Exercises Menu' });

        // Display a button to start the free interval practice
        this.freePracticeButton = new Setting(contentEl)
            .setName('Free Interval Training')
            .setDesc('Practice intervals freely')
            .addButton(button => {
                button
                    .setButtonText('Start Free Interval Training')
                    .onClick(() => {
                        // Open the Free Interval Training modal
                        new IntervalTrainingModal(this.app, {exerciseId: 0, settings: this.plugin.settings}, this.audioUtils).open();
                    });
            });

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
