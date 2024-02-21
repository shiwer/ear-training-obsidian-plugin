// ear-training-plugin/menu-modal.ts
import { App, Modal, Setting } from 'obsidian';
import { chordsMap } from './../utils/constants';
import { noteNames } from './../utils/audio-utils';
import EarTrainingPlugin from './../main';

export default class ChordsSettingsModal extends Modal {

    constructor(app: App, private plugin: EarTrainingPlugin) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
		contentEl.createEl('h2', { text: 'Chords' });
                
		contentEl.createEl('h3', { text: 'Select Chords' });

		// Add UI for interval selection using toggle buttons
		for (const key in chordsMap) {
			if (Object.prototype.hasOwnProperty.call(chordsMap, key)) {
				new Setting(contentEl)
					.setName(chordsMap[key])
					.addToggle(toggle => toggle
						.setValue(this.plugin.settings.chords.settings.selectedNotes.includes(key))
						.onChange(async (value) => {
							if (value) {
								// Add the interval to the selected intervals list
								this.plugin.settings.chords.settings.selectedNotes.push(key);
							} else {
								// Remove the interval from the selected intervals list
								const index = this.plugin.settings.chords.settings.selectedNotes.indexOf(key);
								if (index !== -1) {
									this.plugin.settings.chords.settings.selectedNotes.splice(index, 1);
								}
							}
							await this.plugin.saveSettings();
						}));
			}
		}

		// Add a heading for Options
		contentEl.createEl('h3', { text: 'Options' });

		new Setting(contentEl)
			.setName('Play harmonically')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.chords.settings.isHarmonic)
				.onChange(async (value) => {
					this.plugin.settings.chords.settings.isHarmonic = value

					await this.plugin.saveSettings();
				}));

		new Setting(contentEl)
			.setName('Set a tonality')
			.setDesc('Pick all or a specific tonality note')
			.addDropdown((dropdown) => {
				dropdown.addOption('all', 'all');
				for (const note of noteNames) {
					dropdown.addOption(note, note);
				}
				dropdown.setValue(this.plugin.settings.chords.settings.tonality); // Set the initial value based on the loaded setting
				dropdown.onChange(async (value) => {
					this.plugin.settings.chords.settings.tonality = value

					await this.plugin.saveSettings();
				});
			});

		// Add UI for the number of exercises option
		new Setting(contentEl)
			.setName('Number of Exercises')
			.setDesc('Set the number of exercises per practice')
			.addText(text => text
				.setPlaceholder('Enter a number')
				.setValue(String(this.plugin.settings.chords.settings.numExercises))
				.onChange(async (value) => {
					const numExercises = parseInt(value, 10);
					if (!isNaN(numExercises) && numExercises > 0) {
						this.plugin.settings.chords.settings.numExercises = numExercises;
						await this.plugin.saveSettings();
					}
				}));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
